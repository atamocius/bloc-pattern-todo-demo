import 'dart:async';

import 'package:flutter/material.dart';
import '../blocs/todo_bloc.dart';
import '../models/todo_items.dart';
import '../providers/todo_provider.dart';
import 'add_todo_page.dart';

typedef void CheckboxTapCallback(bool completed);
typedef void RemoveItemCallback(String id);

typedef void TodoItemCheckboxTapCallback(String id, bool completed);

class TodoListItem extends StatelessWidget {
  final TodoItem todoItem;
  final CheckboxTapCallback onCheckboxTap;
  final RemoveItemCallback onRemove;

  TodoListItem(this.todoItem, {Key key, this.onCheckboxTap, this.onRemove})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final icon = this.todoItem.completed
        ? Icon(Icons.check_circle, color: Colors.green, size: 32.0)
        : Icon(Icons.radio_button_unchecked, color: Colors.grey, size: 32.0);

    final textStyle = this.todoItem.completed
        ? TextStyle(
            color: Colors.grey,
            decoration: TextDecoration.lineThrough,
          )
        : null;

    return Column(
      children: <Widget>[
        Dismissible(
          key: Key(this.todoItem.id),
          background: Container(color: Colors.red),
          onDismissed: (dir) {
            if (this.onRemove != null) {
              this.onRemove(this.todoItem.id);
            }
          },
          child: Row(
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 10.0,
                ),
                child: GestureDetector(
                  onTap: () {
                    if (this.onCheckboxTap != null) {
                      this.onCheckboxTap(!this.todoItem.completed);
                    }
                  },
                  child: icon,
                ),
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(right: 12.0),
                  child: Text(
                    this.todoItem.name,
                    overflow: TextOverflow.ellipsis,
                    maxLines: 2,
                    style: textStyle,
                  ),
                ),
              ),
            ],
          ),
        ),
        Divider(height: 1.0),
      ],
    );
  }
}

class TodoList extends StatelessWidget {
  final List<TodoItem> todoItems;
  final TodoItemCheckboxTapCallback onCheckboxTap;
  final RefreshCallback onRefresh;
  final RemoveItemCallback onRemoveItem;

  TodoList(this.todoItems,
      {Key key, this.onCheckboxTap, this.onRefresh, this.onRemoveItem})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      child: ListView.builder(
        // padding: const EdgeInsets.only(top: 30.0),
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: this.todoItems.length,
        itemBuilder: (BuildContext context, int index) {
          final item = this.todoItems[index];
          return TodoListItem(
            item,
            onCheckboxTap: (completed) {
              if (this.onCheckboxTap != null) {
                this.onCheckboxTap(item.id, completed);
              }
            },
            onRemove: this.onRemoveItem,
          );
        },
      ),
      onRefresh: this.onRefresh,
    );
  }
}

class TodoPage extends StatelessWidget {
  Future<TodoItem> _showAddTodoPage(BuildContext context) async {
    // TODO: use pushNamed!
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => AddTodoPage()),
    );

    return result;
  }

  @override
  Widget build(BuildContext context) {
    final bloc = TodoProvider.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Todos'),
        actions: <Widget>[
          StreamBuilder<Filter>(
            initialData: Filter.all,
            stream: bloc.selectedFilter,
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                print('>ERROR!!!');
                print(snapshot.error);
                return Container();
              }

              if (!snapshot.hasData) {
                print('>NO DATA!');
                return Container();
              }

              return PopupMenuButton<Filter>(
                icon: Icon(Icons.filter_list),
                initialValue: snapshot.data,
                onSelected: (filter) {
                  bloc.updateFilter(filter);
                },
                itemBuilder: (BuildContext context) {
                  return [
                    PopupMenuItem<Filter>(
                      value: Filter.all,
                      child: Text('All'),
                    ),
                    PopupMenuItem<Filter>(
                      value: Filter.active,
                      child: Text('Active'),
                    ),
                    PopupMenuItem<Filter>(
                      value: Filter.completed,
                      child: Text('Completed'),
                    ),
                  ];
                },
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Stack(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(top: 30.0),
              child: StreamBuilder<List<TodoItem>>(
                initialData: [],
                stream: bloc.items,
                builder: (context, snapshot) {
                  if (snapshot.hasError) {
                    print('ERROR!!!');
                    print(snapshot.error);
                    return Container();
                  }

                  if (!snapshot.hasData) {
                    print('NO DATA!');
                    return Container();
                  }

                  print('TODO ITEMS: ${snapshot.data}');
                  return TodoList(
                    snapshot.data,
                    onCheckboxTap: (String id, bool completed) {
                      bloc.updateCompleted(id, completed);
                    },
                    onRefresh: () async {
                      bloc.refresh();
                    },
                    onRemoveItem: (String id) {
                      bloc.remove(id);

                      Scaffold.of(context).showSnackBar(
                          SnackBar(content: Text('Item removed')));
                    },
                  );
                },
              ),
            ),
            Container(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  StreamBuilder<Filter>(
                    initialData: Filter.all,
                    stream: bloc.selectedFilter,
                    builder: (context, snapshot) {
                      if (snapshot.hasError) {
                        print('>>ERROR!!!');
                        print(snapshot.error);
                        return Container();
                      }

                      if (!snapshot.hasData) {
                        print('>>NO DATA!');
                        return Container();
                      }

                      String display;
                      switch (snapshot.data) {
                        case Filter.active:
                          display = 'active';
                          break;
                        case Filter.completed:
                          display = 'completed';
                          break;
                        default:
                          display = 'all';
                          break;
                      }

                      return Text('Showing $display items');
                    },
                  ),
                ],
              ),
              color: Colors.grey[300],
              height: 30.0,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final newItem = await _showAddTodoPage(context);
          print(newItem);
          debugPrint('>>> $newItem');
          if (newItem != null) {
            bloc.add(newItem);
          }
        },
        tooltip: 'Add Todo',
        child: Icon(Icons.add),
      ),
    );
  }
}
