// eslint-disable-next-line strict
'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted, container, headerInput) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    this.container = document.querySelector(container);
    this.headerInput = document.querySelector(headerInput);
  }

  addToStorage() {
    localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
    this.headerInput.value = '';
  }

  createItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `);
    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(e) {
    e.preventDefault();
    if (this.input.value.trim() === '') {
      alert('Не могу добавить пустое поле');
    } else {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.render();
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(key) {
    this.todoData.forEach(item => {
      if (item.key === key) {
        this.todoData.delete(item.key);
      }
    });
    this.render();
  }

  completedItem(key) {
    this.todoData.forEach(item => {
      if (item.key === key) {
        if (item.completed) {
          item.completed = false;
        } else {
          item.completed = true;
        }
      }
    });
    this.render();
  }

  handler() {
    this.container.addEventListener('click', e => {
      const target = e.target;
      if (target.classList.contains('todo-complete')) {
        this.completedItem(target.closest('.todo-item').key);
      } else if (target.classList.contains('todo-remove')) {
        this.deleteItem(target.closest('.todo-item').key);
      }
    });
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
    this.handler();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list',
  '.todo-completed', '.todo-container', '.header-input');

todo.init();
