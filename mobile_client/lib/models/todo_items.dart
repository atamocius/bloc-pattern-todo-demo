import 'dart:convert';

class TodoItems {
  final Iterable<TodoItem> items;

  TodoItems(this.items);

  factory TodoItems.fromJson(Map<String, dynamic> json) {
    var jsonItems = json['items'] as List;
    var todoItems = jsonItems.map((item) => TodoItem.fromJson(item));
    return TodoItems(todoItems);
  }

  Map<String, dynamic> toJson() => {
        'items': this.items.map((item) => item.toJson()).toList(),
      };

  @override
  String toString() => JsonEncoder().convert(this.toJson());
}

class TodoItem {
  final String id;
  final String name;
  final bool completed;

  TodoItem({this.id, this.name, this.completed = false});

  TodoItem.fromJson(Map<String, dynamic> json)
      : this.id = json['id'],
        this.name = json['name'],
        this.completed = json['completed'];

  Map<String, dynamic> toJson() {
    var json = {
      'name': this.name,
      'completed': this.completed,
    };

    if (this.id != null) {
      json['id'] = this.id;
    }

    return json;
  }

  @override
  String toString() => JsonEncoder().convert(this.toJson());
}
