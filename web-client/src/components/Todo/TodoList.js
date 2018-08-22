import React from 'react';
import { List } from 'semantic-ui-react';

import EditableTodoItem from './EditableTodoItem';

const TodoList = ({
  items,
  onItemCheckboxChange,
  onItemValueChange,
  onItemDelete,
}) => {
  const todos = items.map(item => (
    <List.Item key={item.id}>
      <EditableTodoItem
        value={item.name}
        completed={item.completed}
        onCheckboxChange={c => onItemCheckboxChange(item.id, c)}
        onValueChange={t => onItemValueChange(item.id, t)}
        onDelete={() => onItemDelete(item.id)}
      />
    </List.Item>
  ));

  return <List size="big">{todos}</List>;
};

export default TodoList;
