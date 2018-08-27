using System.Collections.Generic;

namespace todo_data.Models
{
    public class TodoItems
    {
        public IEnumerable<TodoItem> Items { get; set; }
    }
}
