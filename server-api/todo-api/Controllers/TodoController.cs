using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using todo_business;
using todo_data.Models;

namespace todo_api
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private ITodos todos;

        public TodoController(ITodos todos)
        {
            this.todos = todos;
        }

        [HttpGet]
        public ActionResult<TodoItems> GetAll()
        {
            return this.Ok(this.todos.GetAll());
        }

        [HttpGet("{id}", Name = "GetTodo")]
        public ActionResult<TodoItem> GetById(Guid id)
        {
            var item = this.todos.GetById(id);
            if (item == null)
            {
                return this.NotFound();
            }
            return this.Ok(item);
        }

        [HttpPost]
        public IActionResult Create(TodoItem item)
        {
            this.todos.Add(item);

            return this.CreatedAtRoute("GetTodo", new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, TodoItem item)
        {
            var todo = this.todos.Update(item);

            if (todo == null)
            {
                return this.NotFound();
            }

            return this.NoContent();
        }

        [HttpPatch("{id}/{completed}")]
        public IActionResult UpdateCompleted(Guid id, bool completed)
        {
            var todo = this.todos.UpdateCompleted(id, completed);

            if (todo == null)
            {
                return this.NotFound();
            }

            return this.NoContent();
        }

        [HttpPatch("{id}")]
        public IActionResult MarkAsCompleted(Guid id)
        {
            var todo = this.todos.UpdateCompleted(id, true);

            if (todo == null)
            {
                return this.NotFound();
            }

            return this.NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var result = this.todos.Delete(id);

            if (!result)
            {
                return this.NotFound();
            }

            return this.NoContent();
        }
    }
}