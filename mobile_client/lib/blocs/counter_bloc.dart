import 'dart:async';

//class CounterBlocImpl {
//  final PublishSubject<int> _subject;
//
//  CounterBlocImpl() : _subject = PublishSubject();
//
//  Stream<int> get counter => _subject.scan((count, v, _) => count + v, 0);
//
//  void increment() => _subject.add(1);
//  void decrement() => _subject.add(-1);
//  void dispose() => _subject.close();
//}

abstract class CounterBloc {
  Stream<int> counter;
  Sink<int> _counterSink;
  void increment() => _counterSink.add(1);
  void decrement() => _counterSink.add(-1);
  void dispose() => _counterSink.close();
}

// class CounterBlocImpl extends CounterBloc {
//   final PublishSubject<int> _subject;

//   CounterBlocImpl() : _subject = PublishSubject();

//   Sink<int> get _counterSink => _subject;
//   Stream<int> get counter => _subject.scan((count, v, _) => count + v, 0);
// }

class CounterBlocImpl extends CounterBloc {
  final StreamController<int> _countController;

  int _count;

  CounterBlocImpl()
      : _countController = StreamController(),
        _count = 0;

  Sink<int> get _counterSink => _countController;

  Stream<int> get counter {
    return _countController.stream.map((v) {
      _count += v;
      return _count;
    });
  }
}
