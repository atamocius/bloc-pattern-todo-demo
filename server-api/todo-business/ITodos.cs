using System;
using System.Collections.Generic;
using todo_data.Models;

namespace todo_business
{
    public interface ITodos
    {
        Todo Add(Todo item);
        bool Delete(Guid id);
        IEnumerable<Todo> GetAll();
        Todo GetById(Guid id);
        Todo Update(Todo item);
        Todo UpdateCompleted(Guid id, bool completed);
    }
}
