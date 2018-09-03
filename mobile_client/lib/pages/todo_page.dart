import 'package:flutter/material.dart';
import '../models/todo_items.dart';
import '../providers/todo_provider.dart';

typedef void IconTapCallback(bool complete);

class TodoListItem extends StatelessWidget {
  final TodoItem todoItem;
  final IconTapCallback onTap;

  TodoListItem(this.todoItem, {Key key, this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final icon = this.todoItem.completed
        ? Icon(Icons.check_circle, color: Colors.green, size: 32.0)
        : Icon(Icons.radio_button_unchecked, color: Colors.grey, size: 32.0);

    return Padding(
      padding: const EdgeInsets.only(right: 12.0),
      child: Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 8.0,
                ),
                child: GestureDetector(
                  onTap: () {
                    return this.onTap == null
                        ? null
                        : this.onTap(!this.todoItem.completed);
                  },
                  child: icon,
                ),
              ),
              Expanded(
                child: Text(
                  this.todoItem.name,
                  overflow: TextOverflow.ellipsis,
                  maxLines: 2,
                ),
              ),
            ],
          ),
          Divider(height: 1.0),
        ],
      ),
    );
  }
}

class TodoList extends StatelessWidget {
  final TodoItems todoItems;

  TodoList(this.todoItems, {Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: ListView.builder(
        shrinkWrap: true,
        itemBuilder: (BuildContext context, int index) {
          final item = this.todoItems.items[index];
          return TodoListItem(item);
        },
      ),
    );
  }
}

class TodoPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final bloc = TodoProvider.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Todo BLoC Demo'),
      ),
      // body: StreamBuilder<Iterable<TodoItem>>(
      //   initialData: [],
      //   stream: bloc.items,
      //   builder: (context, snapshot) {
      //     return Text('${snapshot.data}');
      //   },
      // ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: ListView(
              shrinkWrap: true,
              // padding: const EdgeInsets.all(20.0),
              children: <Widget>[
                TodoListItem(
                  TodoItem(
                    name:
                        'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart',
                  ),
                ),
                TodoListItem(
                  TodoItem(name: 'Buy milk', completed: true),
                  onTap: (complete) {
                    print(complete);
                  },
                ),
                TodoListItem(
                  TodoItem(name: 'Jump 3 times'),
                ),
                TodoListItem(
                  TodoItem(
                      name:
                          'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart'),
                ),
                TodoListItem(
                  TodoItem(
                      name:
                          'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart'),
                ),
                TodoListItem(
                  TodoItem(
                      name:
                          'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart'),
                ),
                TodoListItem(
                  TodoItem(
                      name:
                          'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart'),
                ),
                TodoListItem(
                  TodoItem(
                      name:
                          'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart'),
                ),
                TodoListItem(
                  TodoItem(
                      name:
                          'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart'),
                ),
                TodoListItem(
                  TodoItem(
                      name:
                          'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart'),
                ),
                TodoListItem(
                  TodoItem(
                      name:
                          'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart'),
                ),
                TodoListItem(
                  TodoItem(
                      name:
                          'When you smile, you knock me out, I fall apart I fall apart I fall apart I fall apart'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
