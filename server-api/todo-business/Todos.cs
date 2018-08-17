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

        public IEnumerable<Todo> GetAll()
        {
            return this.repository.GetAll();
        }

        public Todo GetById(Guid id)
        {
            return this.repository.GetById(id);
        }

        public Todo Add(Todo item)
        {
            return this.repository.Add(item);
        }

        public Todo Update(Todo item)
        {
            return this.repository.Update(item);
        }

        public Todo UpdateCompleted(Guid id, bool completed)
        {
            return this.repository.UpdateCompleted(id, completed);
        }

        public bool Delete(Guid id)
        {
            return this.repository.Delete(id);
        }
    }
}