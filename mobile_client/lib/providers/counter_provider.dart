import 'package:flutter/widgets.dart';
import '../blocs/counter_bloc.dart';

class CounterProvider extends InheritedWidget {
  final CounterBloc bloc;

  CounterProvider({
    Key key,
    this.bloc,
    Widget child,
  }) : super(key: key, child: child);

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) => true;

  static CounterBloc of(BuildContext context) =>
      (context.inheritFromWidgetOfExactType(CounterProvider) as CounterProvider)
          .bloc;
}
