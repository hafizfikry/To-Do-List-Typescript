interface ToDo{
    id: number,
    task: string,
    category: string,
    dl: number,
    completed: boolean,
}

const category = ['work', 'vacation', 'meeting']

const todoForm = document.getElementById("todoForm") as HTMLFormElement
const todoTask = document.getElementById("todoTask") as HTMLInputElement
const todoDayleft = document.getElementById("todoDayleft") as HTMLInputElement
const todoCategory = document.getElementById('todoCategory') as HTMLInputElement
const todoList = document.getElementById("todoList") as HTMLUListElement

const filterCategory = document.getElementById("filterCategory") as HTMLSelectElement

//table
const tList = document.getElementById('tList') as HTMLUListElement

function calculateDaysleft(dl:number): string{
    if (dl > 1) {
        return `${dl} days left`;
    } else if (dl === 1) {
        return `1 day left`;
    } else {
        return `Deadline passed`;
    }
}

let todos: ToDo[] = JSON.parse(localStorage.getItem('todos') || '[]' )
let categories : string[] = category

function renderTodos(filteredTodos: ToDo[] = todos) {
    todoList.innerHTML = ''
    tList.innerHTML = ''
    filteredTodos.forEach((todo, index) => {
        //Table
        const listId = document.createElement('td')
        const listTask = document.createElement('td')
        const listCategory = document.createElement('td')
        const listDaysleft = document.createElement('td')
        const listStatus = document.createElement('td')
        const listAction = document.createElement('td')

        const row = document.createElement("tr")

        listId.textContent = (index + 1).toString()
        listTask.textContent = `${todo.task}`
        listCategory.textContent = `${todo.category}`
        listDaysleft.textContent = `${todo.dl} Days left`

        if (todo.completed) {
            listStatus.textContent = `completed`
        } else {
            listStatus.textContent = `not completed`
        }
        listAction.appendChild(buttonDelete(todo.id))

        row.dataset.id = todo.id.toString()
        row.classList.add('align-middle')

        row.appendChild(listId)
        row.appendChild(listTask)
        row.appendChild(listCategory)
        row.appendChild(listDaysleft)
        row.appendChild(listStatus)
        row.appendChild(listAction)

        tList.appendChild(row)
        //
    })
}

function filterTodos() {
    const filter = filterCategory.value
    
    if (filter === 'all') {
        renderTodos(todos)
    } else {
        const filteredTodos = todos.filter(todo => todo.category === filter)
        renderTodos(filteredTodos)
    }
}

(window as any).filterTodos = filterTodos

function buttonDelete(todoId: number) {
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
        const listCategory = document.createElement('option')
        
        listCategory.value = `${category}`
        listCategory.textContent = `${category}`

        todoCategory.appendChild(listCategory)
    });
}

function addTodo(task: string, dl: number, category: string){
    if (isNaN(dl) || dl < 0) {
        alert("Please enter a valid number of days.");
        return;
    }

    const newTodo: ToDo = {
        id: Date.now(),
        task,
        category,
        dl,
        completed: false,
    }
    todos.push(newTodo)
    localStorage.setItem('todos', JSON.stringify(todos))

    console.log(newTodo)
    renderTodos()
}

function deleteTodo(id:number) {
    todos = todos.filter(todo => todo.id !== id )
    localStorage.setItem('todos', JSON.stringify(todos))
    renderTodos()
}

function toogleCompleted(id:number) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return {...todo, completed: !todo.completed}
        }
        return todo
    })    
    localStorage.setItem('todos', JSON.stringify(todos))
    renderTodos()
}

todoForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const task = todoTask.value.trim()
    const category = todoCategory.value.trim()
    const dl = todoDayleft.valueAsNumber.valueOf()
    if (task && !isNaN(dl)) {
        addTodo(task, dl, category)
        todoTask.value = ''
        todoDayleft.value = ''
        todoCategory.value = ''
    }
})

renderTodos()
renderCategory()

// console.log(categories)