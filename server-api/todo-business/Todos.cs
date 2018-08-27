using System;
using System.Collections.Generic;
using todo_data;
using todo_data.Models;

namespace todo_business
{
    public class Todos : ITodos
    {
        private readonly ITodoRepository repository;

        public Todos(ITodoRepository repository)
        {
            this.repository = repository;
        }

        public TodoItems GetAll()
        {
            return this.repository.GetAll();
        }

        public TodoItem GetById(Guid id)
        {
            return this.repository.GetById(id);
        }

        public TodoItem Add(TodoItem item)
        {
            return this.repository.Add(item);
        }

        public TodoItem Update(TodoItem item)
        {
            return this.repository.Update(item);
        }

        public TodoItem UpdateCompleted(Guid id, bool completed)
        {
            return this.repository.UpdateCompleted(id, completed);
        }

        public bool Delete(Guid id)
        {
            return this.repository.Delete(id);
        }
    }
}