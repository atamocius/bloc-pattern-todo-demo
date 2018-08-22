import React, { Component } from 'react';
import { Input, Form } from 'semantic-ui-react';

class NewTodoForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  render() {
    const { value } = this.state;

    return (
      <Form size="big" onSubmit={() => this._handleSubmit()}>
        <Form.Field>
          <Input
            placeholder="What needs to be done?"
            value={value}
            onChange={e => this._handleChange(e.currentTarget.value)}
          />
        </Form.Field>
      </Form>
    );
  }

  _handleChange(value) {
    this.setState({
      value,
    });
  }

  _handleSubmit() {
    this.props.onSubmit(this.state.value);

    this.setState({
      value: '',
    });
  }
}

export default NewTodoForm;
