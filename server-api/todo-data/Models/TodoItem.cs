using System;

namespace todo_data.Models
{
    public class TodoItem
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool Completed { get; set; }
    }
}
