import React, { Component, Fragment } from 'react';
import { Header, Container } from 'semantic-ui-react';
import shortid from 'shortid';

import NewTodoForm from './NewTodoForm';
import TodoList from './TodoList';
import FilterOptions, { Filter } from './FilterOptions';

const sampleItems = [
  {
    id: 'aaa',
    text: 'Item A',
    completed: false,
  },
  {
    id: 'bbb',
    text: 'Item B',
    completed: false,
  },
  {
    id: 'ccc',
    text: 'Item C',
    completed: false,
  },
];

class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: sampleItems,
      filteredItems: sampleItems,
      selectedFilter: Filter.all,
    };
  }

  render() {
    const { items, filteredItems } = this.state;

    const activeItemsCount = items.filter(i => !i.completed).length;

    return (
      <Container>
        <Header as="h1">todos</Header>
        <NewTodoForm onSubmit={v => this._handleNewItemSubmit(v)} />
        <TodoList
          items={filteredItems}
          onItemCheckboxChange={(id, c) =>
            this._handleItemCheckboxChange(id, c)
          }
          onItemValueChange={(id, t) => this._handleItemValueChange(id, t)}
          onItemDelete={id => this._handleItemDelete(id)}
        />
        <FilterOptions
          activeItemsCount={activeItemsCount}
          onFilterChange={f => this._handleFilterChange(f)}
        />
      </Container>
    );
  }

  _handleNewItemSubmit(value) {
    const items = this.state.items.slice();
    items.push({
      id: shortid(),
      text: value,
      completed: false,
    });

    this.setState({
      items,
      filteredItems: this._applyFilter(items, this.state.selectedFilter),
    });
  }

  _handleItemCheckboxChange(id, checked) {
    const items = this.state.items.slice();
    const matchedIndex = items.findIndex(item => item.id === id);
    items[matchedIndex].completed = checked;

    this.setState({
      items,
      filteredItems: this._applyFilter(items, this.state.selectedFilter),
    });
  }

  _handleItemValueChange(id, text) {
    const items = this.state.items.slice();
    const matchedIndex = items.findIndex(item => item.id === id);
    items[matchedIndex].text = text;
    items[matchedIndex].editing = false;

    this.setState({
      items,
      filteredItems: this._applyFilter(items, this.state.selectedFilter),
    });
  }

  _handleItemDelete(id) {
    const items = this.state.items.slice();
    const matchedIndex = items.findIndex(item => item.id === id);
    items.splice(matchedIndex, 1);

    this.setState({
      items,
      filteredItems: this._applyFilter(items, this.state.selectedFilter),
    });
  }

  _handleFilterChange(filter) {
    this.setState({
      selectedFilter: filter,
      filteredItems: this._applyFilter(this.state.items, filter),
    });
  }

  _applyFilter(items, filter) {
    switch (filter) {
      case Filter.active:
        return items.filter(i => !i.completed);

      case Filter.completed:
        return items.filter(i => i.completed);

      default:
        //Filter.all
        return items;
    }
  }
}

export default Todo;
