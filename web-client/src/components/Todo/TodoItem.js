import './TodoItem.css';

import React, { Component } from 'react';
import classNames from 'classnames';
import { Icon } from 'semantic-ui-react';

class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovering: false,
    };
  }

  render() {
    const {
      label,
      completed,
      onCheckboxChange,
      onBodyDoubleClick,
      onDelete,
    } = this.props;
    const { hovering } = this.state;

    const checkIcon = completed ? (
      <Icon name="check circle outline" size="large" color="green" />
    ) : (
      <Icon name="circle outline" size="large" />
    );

    const closeButtonClass = classNames('todo-item__close-button', {
      'todo-item__close-button--visible': hovering,
    });

    const labelClass = classNames('todo-item__label', {
      'todo-item__label--completed': completed,
    });

    return (
      <div
        className="todo-item"
        onMouseEnter={() => this._handleMouseOver(true)}
        onMouseLeave={() => this._handleMouseOver(false)}
      >
        <div
          className="todo-item__checkbox"
          onClick={() => onCheckboxChange(!completed)}
        >
          {checkIcon}
        </div>
        <div className="todo-item__body" onDoubleClick={onBodyDoubleClick}>
          <span className={labelClass}>{label}</span>
          <div className={closeButtonClass} onClick={onDelete}>
            <Icon name="close" color="red" />
          </div>
        </div>
      </div>
    );
  }

  _handleMouseOver(hovering) {
    this.setState({
      hovering,
    });
  }
}

export default TodoItem;
