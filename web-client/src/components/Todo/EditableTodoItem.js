import React, { Component } from 'react';

import TodoItem from './TodoItem';
import TodoItemEdit from './TodoItemEdit';

class EditableTodoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };
  }

  render() {
    const { value, done, onCheckboxChange, onDelete } = this.props;
    const { editing } = this.state;

    return editing ? (
      <TodoItemEdit value={value} onSubmit={t => this._handleSubmit(t)} />
    ) : (
      <TodoItem
        label={value}
        done={done}
        onCheckboxChange={onCheckboxChange}
        onBodyDoubleClick={() => this._handleBodyDoubleClick()}
        onDelete={onDelete}
      />
    );
  }

  _handleBodyDoubleClick() {
    this.setState({
      editing: true,
    });
  }

  _handleSubmit(text) {
    this.setState({
      editing: false,
    });

    this.props.onValueChange(text);
  }
}

export default EditableTodoItem;
