import 'package:flutter/material.dart';
import '../blocs/todo_bloc.dart';
import '../services/todo_service.dart';
import '../models/todo_items.dart';

class TodoPage extends StatefulWidget {
  final TodoService service;
  final TodoBloc bloc;

  TodoPage(this.service, {Key key})
      : bloc = TodoBlocImpl(service),
        super(key: key);

  @override
  _TodoPageState createState() => _TodoPageState();
}

class _TodoPageState extends State<TodoPage> {
  @override
  void dispose() {
    widget.bloc.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Todo BLoC Demo'),
      ),
      body: StreamBuilder<Iterable<TodoItem>>(
        initialData: [],
        stream: widget.bloc.items,
        builder: (context, snapshot) {
          return Text('${snapshot.data}');
        },
      ),
    );
  }
}
