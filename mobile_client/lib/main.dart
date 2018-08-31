import 'package:flutter/material.dart';
import 'pages/counter_page.dart';
import 'pages/todo_page.dart';
import 'services/todo_service.dart';
import 'blocs/counter_bloc.dart';
import 'blocs/todo_bloc.dart';
import 'providers/counter_provider.dart';
import 'providers/todo_provider.dart';

void main() {
  final counterBloc = CounterBlocImpl();

  final todoService = TodoServiceImpl(
    Uri.parse('http://10.0.2.2:5000/api/todo'),
  );
  final todoBloc = TodoBlocImpl(todoService);

  runApp(MyApp(
    counterBloc: counterBloc,
    todoBloc: todoBloc,
  ));
}

class MyApp extends StatefulWidget {
  final CounterBloc counterBloc;
  final TodoBloc todoBloc;

  MyApp({this.counterBloc, this.todoBloc});

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void dispose() {
    widget.counterBloc.dispose();
    widget.todoBloc.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      // home: CounterProvider(
      //   bloc: widget.counterBloc,
      //   child: CounterPage(),
      // ),
      home: TodoProvider(
        bloc: widget.todoBloc,
        child: TodoPage(),
      ),
    );
  }
}
