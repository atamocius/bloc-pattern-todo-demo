import React, { Component } from 'react';

import Counter from './components/Counter';
import Todo from './components/Todo';

import TodoService from './services/TodoService';

import CounterBloc from './blocs/CounterBloc';
import TodoBloc from './blocs/TodoBloc';

const todoService = new TodoService('http://localhost:5000/api/todo');

const counterBloc = new CounterBloc();
const todoBloc = new TodoBloc(todoService);
// todoBloc.items.subscribe({
//   next: items => console.log('ITEMS:::', JSON.parse(JSON.stringify(items))),
//   error: error => console.error('ITEMS:::', error),
//   complete: () => console.log('ITEMS:::', 'Completed!'),
// });
// // todoBloc.items.subscribe({
// //   next: items => console.log('ITEMS 2:::', JSON.parse(JSON.stringify(items))),
// //   error: error => console.error('ITEMS 2:::', error),
// //   complete: () => console.log('ITEMS 2:::', 'Completed!'),
// // });
// todoBloc.showAll.subscribe({
//   next: items => console.log('SHOW ALL:::', JSON.parse(JSON.stringify(items))),
//   error: error => console.error('SHOW ALL:::', error),
//   complete: () => console.log('SHOW ALL:::', 'Completed!'),
// });
// todoBloc.add({
//   name: 'hello',
//   completed: false,
// });
// todoBloc.add({
//   name: 'boom',
//   completed: true,
// });
// todoBloc.add({
//   name: 'there',
//   completed: false,
// });
// todoBloc.showAll = false;
// todoBloc.showAll = true;

class App extends Component {
  render() {
    // return <Counter bloc={counterBloc} />;
    return <Todo bloc={todoBloc} />;
  }
}

export default App;
