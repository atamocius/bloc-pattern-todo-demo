import 'dart:async';

import 'package:flutter/material.dart';
import '../models/todo_items.dart';
import '../providers/todo_provider.dart';
import 'add_todo_page.dart';

typedef void CheckboxTapCallback(bool completed);
typedef void TodoItemCheckboxTapCallback(String id, bool completed);

class TodoListItem extends StatelessWidget {
  final TodoItem todoItem;
  final CheckboxTapCallback onCheckboxTap;

  TodoListItem(this.todoItem, {Key key, this.onCheckboxTap}) : super(key: key);

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
                  vertical: 10.0,
                ),
                child: GestureDetector(
                  onTap: () {
                    return this.onCheckboxTap == null
                        ? null
                        : this.onCheckboxTap(!this.todoItem.completed);
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
  final List<TodoItem> todoItems;
  final TodoItemCheckboxTapCallback onCheckboxTap;
  final RefreshCallback onRefresh;

  TodoList(this.todoItems, {Key key, this.onCheckboxTap, this.onRefresh})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      child: ListView.builder(
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
        title: Text('Todo BLoC Demo'),
      ),
      // body: StreamBuilder<Iterable<TodoItem>>(
      //   initialData: [],
      //   stream: bloc.items,
      //   builder: (context, snapshot) {
      //     return Text('${snapshot.data}');
      //   },
      // ),
      body: SafeArea(
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

            // if (snapshot.data.length == 0) {
            //   print('EMPTY LIST!');
            //   return Container();
            // }

            print('TODO ITEMS: ${snapshot.data}');
            return TodoList(
              snapshot.data,
              onCheckboxTap: (String id, bool completed) {
                bloc.updateCompleted(id, completed);
              },
              onRefresh: () async {
                bloc.refresh();
              },
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final newItem = await _showAddTodoPage(context);
          bloc.add(newItem);
        },
        tooltip: 'Add Todo',
        child: Icon(Icons.add),
      ),
    );
  }
}
