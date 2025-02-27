"use strict";
const category = ['work', 'vacation', 'meeting'];
const todoForm = document.getElementById("todoForm");
const todoTask = document.getElementById("todoTask");
const todoDayleft = document.getElementById("todoDayleft");
const todoCategory = document.getElementById('todoCategory');
const todoList = document.getElementById("todoList");
const filterCategory = document.getElementById("filterCategory");
//table
const tList = document.getElementById('tList');
function calculateDaysleft(dl) {
    if (dl > 1) {
        return `${dl} days left`;
    }
    else if (dl === 1) {
        return `1 day left`;
    }
    else {
        return `Deadline passed`;
    }
}
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let categories = category;
function renderTodos(filteredTodos = todos) {
    todoList.innerHTML = '';
    tList.innerHTML = '';
    filteredTodos.forEach((todo, index) => {
        //Table
        const listId = document.createElement('td');
        const listTask = document.createElement('td');
        const listCategory = document.createElement('td');
        const listDaysleft = document.createElement('td');
        const listStatus = document.createElement('td');
        const listAction = document.createElement('td');
        const row = document.createElement("tr");
        listId.textContent = (index + 1).toString();
        listTask.textContent = `${todo.task}`;
        listCategory.textContent = `${todo.category}`;
        if (todo.category === "meeting") {
            listCategory.classList.add("text-primary-emphasis");
        }
        else if (todo.category === "work") {
            listCategory.classList.add("text-warning");
        }
        else if (todo.category === "vacation") {
            listCategory.classList.add("text-info");
        }
        listDaysleft.textContent = `${todo.dl} Days left`;
        listStatus.classList.add('btn');
        listStatus.addEventListener('click', () => toogleCompleted(todo.id));
        if (todo.completed) {
            listStatus.textContent = `completed`;
            listStatus.classList.add('text-success');
        }
        else {
            listStatus.textContent = `not completed`;
            listStatus.classList.add('text-danger');
        }
        listAction.appendChild(buttonDelete(todo.id));
        row.dataset.id = todo.id.toString();
        row.classList.add('align-middle');
        row.appendChild(listId);
        row.appendChild(listTask);
        row.appendChild(listCategory);
        row.appendChild(listDaysleft);
        row.appendChild(listStatus);
        row.appendChild(listAction);
        tList.appendChild(row);
        //
    });
}
function filterTodos() {
    const filter = filterCategory.value;
    if (filter === 'all') {
        renderTodos(todos);
    }
    else {
        const filteredTodos = todos.filter(todo => todo.category === filter);
        renderTodos(filteredTodos);
    }
}
window.filterTodos = filterTodos;
function buttonDelete(todoId) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        deleteTodo(todoId);
    });
    return deleteButton;
}
function renderCategory() {
    // todoCategory.innerHTML = ''
    categories.forEach(category => {
        const listCategory = document.createElement('option');
        listCategory.value = `${category}`;
        listCategory.textContent = `${category}`;
        todoCategory.appendChild(listCategory);
    });
}
function addTodo(task, dl, category) {
    if (isNaN(dl) || dl < 0) {
        alert("Please enter a valid number of days.");
        return;
    }
    const newTodo = {
        id: Date.now(),
        task,
        category,
        dl,
        completed: false,
    };
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log(newTodo);
    renderTodos();
}
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}
function toogleCompleted(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return Object.assign(Object.assign({}, todo), { completed: !todo.completed });
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}
todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const task = todoTask.value.trim();
    const category = todoCategory.value.trim();
    const dl = todoDayleft.valueAsNumber.valueOf();
    if (task && !isNaN(dl)) {
        addTodo(task, dl, category);
        todoTask.value = '';
        todoDayleft.value = '';
        todoCategory.value = '';
    }
});
renderTodos();
renderCategory();
// console.log(categories)
