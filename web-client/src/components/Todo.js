import React, { Component, Fragment } from 'react';
import {
  Menu,
  Icon,
  List,
  Checkbox,
  Input,
  Form,
  Button,
  Header,
  Container,
  MenuHeader,
} from 'semantic-ui-react';

import TodoItem from './TodoItem';
import TodoItemEdit from './TodoItemEdit';

class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        {
          id: 'aaa',
          text: 'Item A',
          checked: false,
          editing: false,
        },
        {
          id: 'bbb',
          text: 'Item B',
          checked: false,
          editing: false,
        },
        {
          id: 'ccc',
          text: 'Item C',
          checked: false,
          editing: false,
        },
      ],
    };
  }

  render() {
    const { items } = this.state;

    const todos = items.map(item => {
      const inner = item.editing ? (
        <TodoItemEdit
          value={item.text}
          onSubmit={t => this._handleItemSubmitEdit(item.id, t)}
          onBlur={t => this._handleItemSubmitEdit(item.id, t)}
        />
      ) : (
        <TodoItem
          label={item.text}
          onChangeCheckbox={c => this._handleItemCheckboxChange(item.id, c)}
          onDoubleClickBody={() => this._handleItemDoubleClickBody(item.id)}
          checked={item.checked}
        />
      );

      return <List.Item key={item.id}>{inner}</List.Item>;
    });

    return (
      <Container>
        <Header as="h1">todos</Header>
        <Form size="big" onSubmit={() => console.log('SUBMITTED!')}>
          <Form.Field>
            <Input placeholder="What needs to be done?" />
          </Form.Field>
        </Form>
        <List size="big">{todos}</List>
        <Menu>
          <Menu.Item>2 items left</Menu.Item>
          <Menu.Item name="all" onClick={(e, { name }) => console.log(name)} />
          <Menu.Item
            active
            name="active"
            onClick={(e, { name }) => console.log(name)}
          />
          <Menu.Item
            name="completed"
            onClick={(e, { name }) => console.log(name)}
          />
        </Menu>
      </Container>
    );
  }

  _handleItemCheckboxChange(id, checked) {
    const items = this.state.items.slice();
    const matchedIndex = items.findIndex(item => item.id === id);
    items[matchedIndex].checked = checked;

    this.setState({
      items,
    });
  }

  _handleItemSubmitEdit(id, text) {
    const items = this.state.items.slice();
    const matchedIndex = items.findIndex(item => item.id === id);
    items[matchedIndex].text = text;
    items[matchedIndex].editing = false;

    this.setState({
      items,
    });
  }

  _handleItemDoubleClickBody(id) {
    const items = this.state.items.slice();
    const matchedIndex = items.findIndex(item => item.id === id);
    items[matchedIndex].editing = true;

    this.setState({
      items,
    });
  }
}

export default Todo;
