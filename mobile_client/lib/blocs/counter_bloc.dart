import 'dart:async';

abstract class CounterBloc {
  Stream<int> counter;
  Sink<int> _counterSink;
  void increment() => _counterSink.add(1);
  void decrement() => _counterSink.add(-1);
  void dispose() => _counterSink.close();
}

class CounterBlocImpl extends CounterBloc {
  final StreamController<int> _countController;

  int _count;

  CounterBlocImpl()
      : _countController = StreamController.broadcast(),
        _count = 0;

  Sink<int> get _counterSink => _countController;

  Stream<int> get counter {
    return _countController.stream.map((v) {
      _count += v;
      return _count;
    });
  }
}
