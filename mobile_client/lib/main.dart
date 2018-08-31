import 'package:flutter/material.dart';
import 'pages/counter_page.dart';
import 'pages/todo_page.dart';
import 'services/todo_service.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: CounterPage(),
      // home: TodoPage(
      //   TodoServiceImpl(Uri.parse('http://10.0.2.2:5000/api/todo')),
      // ),
    );
  }
}
