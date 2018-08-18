import './TodoItemEdit.css';

import React, { Component } from 'react';
import { Input, Form } from 'semantic-ui-react';

class TodoItemEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this._inputRef = React.createRef();
  }

  componentDidMount() {
    this._inputRef.current.focus();
  }

  render() {
    const { onSubmit, onBlur } = this.props;
    const { value } = this.state;

    return (
      <div className="todo-item-edit">
        <Form size="big" onSubmit={() => onSubmit(value)}>
          <Input
            ref={this._inputRef}
            fluid
            value={value}
            onChange={e => this._handleTextChange(e.currentTarget.value)}
            onBlur={e => onBlur(e.currentTarget.value)}
          />
        </Form>
      </div>
    );
  }

  _handleTextChange(value) {
    this.setState({
      value,
    });
  }
}

export default TodoItemEdit;
