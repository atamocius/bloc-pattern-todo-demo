using System;
using System.Collections.Generic;
using todo_data.Models;

namespace todo_data
{
    public class TodoRepository : ITodoRepository
    {
        private static List<TodoItem> items = new List<TodoItem>();

        public TodoRepository()
        {
            items.AddRange(new[]
            {
                new TodoItem { Id = Guid.Parse("5d9c1e85-b945-4be6-b515-6367261e04c4"), Name = "Buy milk", Completed = false },
                new TodoItem { Id = Guid.Parse("d18ca00c-7d95-46d6-9e5d-fdffd571906a"), Name = "Buy ice cream", Completed = true },
                new TodoItem { Id = Guid.Parse("21bb9e16-681c-4a00-a9a3-ad5534999455"), Name = "Buy jump 3 times", Completed = false },
            });
        }

        public TodoItems GetAll()
        {
            return new TodoItems
            {
                Items = items
            };
        }

        public TodoItem GetById(Guid id)
        {
            return items.Find(i => i.Id == id);
        }

        public TodoItem Add(TodoItem item)
        {
            item.Id = Guid.NewGuid();
            items.Add(item);
            return item;
        }

        public TodoItem Update(TodoItem item)
        {
            var todo = this.GetById(item.Id);

            if (todo == null)
            {
                return null;
            }

            todo.Name = item.Name;
            todo.Completed = item.Completed;

            return todo;
        }

        public TodoItem UpdateCompleted(Guid id, bool completed)
        {
            var todo = this.GetById(id);

            if (todo == null)
            {
                return null;
            }

            todo.Completed = completed;

            return todo;
        }

        public bool Delete(Guid id)
        {
            var todo = this.GetById(id);

            if (todo == null)
            {
                return false;
            }

            items.Remove(todo);

            return true;
        }
    }
}
