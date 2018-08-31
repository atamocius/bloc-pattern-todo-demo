import 'package:flutter/material.dart';
import '../models/todo_items.dart';
import '../providers/todo_provider.dart';

class TodoPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final bloc = TodoProvider.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Todo BLoC Demo'),
      ),
      body: StreamBuilder<Iterable<TodoItem>>(
        initialData: [],
        stream: bloc.items,
        builder: (context, snapshot) {
          return Text('${snapshot.data}');
        },
      ),
    );
  }
}
