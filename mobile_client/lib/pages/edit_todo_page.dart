import 'package:flutter/material.dart';
import '../models/todo_items.dart';

class EditTodoPage extends StatefulWidget {
  final TodoItem item;
  final TextEditingController nameController;

  EditTodoPage({Key key, this.item})
      : nameController = TextEditingController(text: item?.name),
        super(key: key);

  @override
  _EditTodoPageState createState() => _EditTodoPageState();
}

class _EditTodoPageState extends State<EditTodoPage> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    String title = widget.item == null ? 'Add Todo' : 'Edit Todo';

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: <Widget>[
                TextFormField(
                  decoration: InputDecoration(labelText: 'Name'),
                  autofocus: true,
                  controller: widget.nameController,
                  validator: (value) {
                    if (value.isEmpty) {
                      return 'Please enter some text';
                    }
                  },
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    RaisedButton(
                      child: Text('Submit'),
                      onPressed: () {
                        if (_formKey.currentState.validate()) {
                          print('Name: ${widget.nameController.text}');
                          Navigator.pop(
                            context,
                            TodoItem(
                              id: widget.item?.id,
                              name: widget.nameController.text,
                              completed: widget.item?.completed ?? false,
                            ),
                          );
                        }
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
