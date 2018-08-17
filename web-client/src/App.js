import React, { Component } from 'react';

import Counter from './components/Counter';

import CounterBloc from './blocs/CounterBloc';
import TodoBloc from './blocs/TodoBloc';

const todoServiceUrl = 'http://localhost:5000/api/todo';

const counterBloc = new CounterBloc();
// const todoBloc = new TodoBloc(todoServiceUrl);
// todoBloc.items.subscribe(items => console.log('sub:', items));
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

class App extends Component {
  render() {
    return <Counter bloc={counterBloc} />;
  }
}

export default App;
