import 'package:flutter/widgets.dart';
import '../blocs/todo_bloc.dart';

class TodoProvider extends InheritedWidget {
  final TodoBloc bloc;

  TodoProvider({
    Key key,
    this.bloc,
    Widget child,
  }) : super(key: key, child: child);

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) => true;

  static TodoBloc of(BuildContext context) =>
      (context.inheritFromWidgetOfExactType(TodoProvider) as TodoProvider).bloc;
}
