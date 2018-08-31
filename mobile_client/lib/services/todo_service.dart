import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

import '../utils/observable_utils.dart';
import '../models/todo_items.dart';

abstract class TodoService {
  Future<TodoItems> getAll();
  Future<TodoItem> add(TodoItem item);
  Future<void> update(String id, TodoItem item);
  Future<void> updateCompleted(String id, bool completed);
  Future<void> remove(String id);
}

class TodoServiceImpl extends TodoService {
  final Uri serviceUri;

  TodoServiceImpl(this.serviceUri);

  Future<TodoItems> getAll() async {
    try {
      var res = await retryableAsync(() => http.get(this.serviceUri));

      if (res.statusCode == 200) {
        return TodoItems.fromJson(json.decode(res.body));
      }

      return Future.error('${res.statusCode}: ${res.body}');
    } catch (e) {
      return Future.error('Fetch Error: $e');
    }
  }

  Future<TodoItem> add(TodoItem item) async {
    try {
      var res = await retryableAsync(
        () => http.post(
              this.serviceUri,
              headers: {
                'Content-Type': 'application/json',
              },
              // body: JsonEncoder().convert(item.toJson()),
              body: item.toString(),
            ),
      );

      if (res.statusCode == 201) {
        return TodoItem.fromJson(json.decode(res.body));
      }

      return Future.error('${res.statusCode}: ${res.body}');
    } catch (e) {
      return Future.error('Fetch Error: $e');
    }
  }

  Future<void> update(String id, TodoItem item) async {
    try {
      var res = await retryableAsync(
        () => http.put(
              '${this.serviceUri}/$id',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JsonEncoder().convert(item.toJson()),
            ),
      );

      if (res.statusCode == 204) {
        return Future.value();
      }

      return Future.error('${res.statusCode}: ${res.body}');
    } catch (e) {
      return Future.error('Fetch Error: $e');
    }
  }

  Future<void> updateCompleted(String id, bool completed) async {
    try {
      var res = await retryableAsync(
        () => http.patch('${this.serviceUri}/$id/$completed'),
      );

      if (res.statusCode == 204) {
        return Future.value();
      }

      return Future.error('${res.statusCode}: ${res.body}');
    } catch (e) {
      return Future.error('Fetch Error: $e');
    }
  }

  Future<void> remove(String id) async {
    try {
      var res = await retryableAsync(
        () => http.delete('${this.serviceUri}/$id'),
      );

      if (res.statusCode == 204) {
        return Future.value();
      }

      return Future.error('${res.statusCode}: ${res.body}');
    } catch (e) {
      return Future.error('Fetch Error: $e');
    }
  }
}
