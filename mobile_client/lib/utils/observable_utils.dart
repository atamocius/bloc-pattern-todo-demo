import 'dart:async';

// typedef AsyncFunc<T> = Future<T> Function();
typedef Future<T> AsyncFunc<T>();

Future<T> retryableAsync<T>(
  AsyncFunc<T> asyncFunc, {
  int retries = 3,
  int timeDelay = 500,
}) async {
  int retryCount = 0;

  while (retryCount < retries) {
    print('Attempt #$retryCount');
    try {
      return await asyncFunc();
    } catch (e) {
      print('Failed attempt #$retryCount: $e');
      await Future.delayed(Duration(milliseconds: timeDelay));
      retryCount++;
    }
  }

  return Future.error('Async failed to execute after $retryCount retries');
}
