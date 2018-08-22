import React, { Component } from 'react';
import { Header, Container } from 'semantic-ui-react';

import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import FilterOptions from './FilterOptions';

import TodoContext from './TodoContext';
import StreamBuilder from '../../utils/StreamBuilder';

class Todo extends Component {
  render() {
    const { bloc } = this.props;

    return (
      <Container>
        <Header as="h1">todos</Header>
        <NewTodoForm onSubmit={v => this._handleNewItemSubmit(v)} />
        <StreamBuilder
          initialData={[]}
          stream={bloc.items}
          builder={snapshot => (
            <TodoList
              items={snapshot.data}
              onItemCheckboxChange={(id, c) =>
                this._handleItemCheckboxChange(id, c)
              }
              onItemValueChange={(id, t) => this._handleItemValueChange(id, t)}
              onItemDelete={id => this._handleItemDelete(id)}
            />
          )}
        />
        <TodoContext.Provider value={bloc}>
          <FilterOptions />
        </TodoContext.Provider>
      </Container>
    );
  }

  _handleNewItemSubmit(value) {
    this.props.bloc.add({
      name: value,
      completed: false,
    });
  }

  _handleItemCheckboxChange(id, checked) {
    this.props.bloc.updateCompleted(id, checked);
  }

  _handleItemValueChange(id, text) {
    this.props.bloc.updateName(id, text);
  }

  _handleItemDelete(id) {
    this.props.bloc.remove(id);
  }
}

export default Todo;
