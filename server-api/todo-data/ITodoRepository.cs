using System;
using System.Collections.Generic;
using todo_data.Models;

namespace todo_data
{
    public interface ITodoRepository
    {
        TodoItem Add(TodoItem item);
        bool Delete(Guid id);
        TodoItems GetAll();
        TodoItem GetById(Guid id);
        TodoItem Update(TodoItem item);
        TodoItem UpdateCompleted(Guid id, bool completed);
    }
}
