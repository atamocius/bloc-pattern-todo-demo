import 'dart:async';
import 'package:async/async.dart';

import '../models/todo_items.dart';
import '../services/todo_service.dart';

enum Filter {
  all,
  active,
  completed,
}

enum ItemOp {
  add,
  remove,
  updateFilter,
  updateName,
  updateCompleted,
}

class Op {
  ItemOp op;

  TodoItem item;
  String id;
  String name;
  bool completed;
  Filter filter;

  Op();

  factory Op.add(TodoItem item) => Op()
    ..op = ItemOp.add
    ..item = item;

  factory Op.remove(String id) => Op()
    ..op = ItemOp.remove
    ..id = id;

  factory Op.updateName(String id, String name) => Op()
    ..op = ItemOp.updateName
    ..id = id
    ..name = name;

  factory Op.updateCompleted(String id, bool completed) => Op()
    ..op = ItemOp.updateCompleted
    ..id = id
    ..completed = completed;

  factory Op.updateFilter(Filter filter) => Op()
    ..op = ItemOp.updateFilter
    ..filter = filter;
}

abstract class TodoBloc {
  Stream<Iterable<TodoItem>> items;
  Stream<int> activeCount;
  Stream<Filter> selectedFilter;

  EventSink<Op> _opSink;

  void dispose() => _opSink.close();

  void add(TodoItem item) {
    _opSink.add(Op.add(item));
  }

  void remove(String id) {
    _opSink.add(Op.remove(id));
  }

  void updateName(String id, String name) {
    _opSink.add(Op.updateName(id, name));
  }

  void updateCompleted(String id, bool completed) {
    _opSink.add(Op.updateCompleted(id, completed));
  }

  void updateFilter(Filter filter) {
    _opSink.add(Op.updateFilter(filter));
  }
}

class TodoBlocImpl extends TodoBloc {
  final TodoService _service;
  final StreamController<int> _activeCountController;
  final StreamController<Filter> _selectedFilterController;
  final StreamController<Op> _opController;

  List<TodoItem> _items;
  Filter _selectedFilter;

  Stream<Iterable<TodoItem>> _itemsStream;

  EventSink<Op> get _opSink => _opController;

  TodoBlocImpl(this._service)
      : _activeCountController = StreamController.broadcast(),
        _selectedFilterController = StreamController.broadcast(),
        _opController = StreamController() {
    //
    final serverItemsStream = Stream.fromFuture(_service.getAll())
        .map((data) => data.items)
        .map((items) => items..forEach((item) => _items.add(item)));

    final opsStream = _opController.stream.asyncMap(
      (op) async => await _executeOp(op),
    );

    // _itemsStream = StreamGroup.merge([
    //   serverItemsStream,
    //   opsStream,
    // ]).asBroadcastStream();
    _itemsStream = LazyStream(() {
      return StreamGroup.merge([
        serverItemsStream,
        opsStream,
      ]).asBroadcastStream();
    });

    _items = List();
    _selectedFilter = Filter.all;
  }

  void dispose() {
    _activeCountController.close();
    _selectedFilterController.close();
    super.dispose();
  }

  Stream<Iterable<TodoItem>> get items {
    return _itemsStream;
  }

  Stream<int> get activeCount {
    return _activeCountController.stream;
  }

  Stream<Filter> get selectedFilter {
    return _selectedFilterController.stream;
  }

  Future<Iterable<TodoItem>> _executeOp(Op op) async {
    print(op.op);

    switch (op.op) {
      case ItemOp.add:
        await _addItem(_service, _items, op.item);
        _updateActiveCount();
        break;

      case ItemOp.remove:
        await _removeItem(_service, _items, op.id);
        _updateActiveCount();
        break;

      case ItemOp.updateName:
        await _updateName(_service, _items, op.id, op.name);
        break;

      case ItemOp.updateCompleted:
        await _updateCompleted(_service, _items, op.id, op.completed);
        _updateActiveCount();
        break;

      case ItemOp.updateFilter:
        _selectedFilter = op.filter;
        _selectedFilterController.add(_selectedFilter);
        break;

      default:
        throw Exception('Unknown operation: ${op.op}');
    }

    return _applyFilter(_items, _selectedFilter);
  }

  void _updateActiveCount() {
    final activeCount = _applyFilter(_items, Filter.active).length;
    _activeCountController.add(activeCount);
  }

  Future<void> _addItem(
    TodoService service,
    List<TodoItem> items,
    TodoItem newItem,
  ) async {
    final newItemWithId = await service.add(newItem);
    items.add(newItemWithId);
  }

  Future<void> _removeItem(
    TodoService service,
    List<TodoItem> items,
    String id,
  ) async {
    final matchedIndex = items.indexWhere((item) => item.id == id);

    if (matchedIndex == -1) {
      throw Exception('Cannot find item with ID = "$id".');
    }

    await service.remove(id);

    items.removeAt(matchedIndex);
  }

  Future<void> _updateName(
    TodoService service,
    List<TodoItem> items,
    String id,
    String name,
  ) async {
    final matchedIndex = items.indexWhere((item) => item.id == id);

    if (matchedIndex == -1) {
      throw Exception('Cannot find item with ID = "$id".');
    }

    final matchedItem = items[matchedIndex];
    final updatedItem = TodoItem(
      id: matchedItem.id,
      name: name,
      completed: matchedItem.completed,
    );

    await service.update(id, updatedItem);

    items[matchedIndex] = updatedItem;
  }

  Future<void> _updateCompleted(
    TodoService service,
    List<TodoItem> items,
    String id,
    bool completed,
  ) async {
    final matchedIndex = items.indexWhere((item) => item.id == id);

    if (matchedIndex == -1) {
      throw Exception('Cannot find item with ID = "$id".');
    }

    await service.updateCompleted(id, completed);

    final matchedItem = items[matchedIndex];
    items[matchedIndex] = TodoItem(
      id: matchedItem.id,
      name: matchedItem.name,
      completed: completed,
    );
  }

  List<TodoItem> _applyFilter(List<TodoItem> items, Filter filter) {
    switch (filter) {
      case Filter.active:
        return items.where((i) => !i.completed).toList();

      case Filter.completed:
        return items.where((i) => i.completed).toList();

      default: // Filter.all
        return items;
    }
  }
}
