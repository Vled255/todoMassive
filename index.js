const todos = [
  { id: 1, title: "Написать todo", completed: false },
  { id: 2, title: "Разработать интернет-магазин", completed: false },
  { id: 3, title: "Не забыть отдохнуть", completed: false },
];
const settings = {
  newTodo: "",
  search: "",
  showAll: true,
  showDone: false,
};

const settingsHandler = {
  set(target, key, value) {
    if (key === "newTodo") {
      settings.showAll = true;
      getInputAllTodos().checked = true;
    }
    target[key] = value;
    return true;
  },
};

const trackedSettings = new Proxy(settings, settingsHandler);

function getInputAllTodos() {
  return document.getElementById("btnradio1");
}

function searchTodo(title) {
  trackedSettings.search = title;
  if (trackedSettings.search === "") {
    renderTodos();
    return;
  }

  const filtredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(trackedSettings.search)
  );
  renderTodos(filtredTodos);
}

function showAllTodos() {
  trackedSettings.showAll = true;
  renderTodos();
}

function showDoneTodos() {
  trackedSettings.showDone = true;
  const filtredTodos = todos.filter((todo) => todo.completed === true);
  renderTodos(filtredTodos);
}

function getTodo(id) {
  return todos.find((todo) => todo.id === id);
}

function toggleTodo(id) {
  const todo = getTodo(id);
  todo.completed = !todo.completed;
}

function getLastId() {
  if (todos.length === 0) {
    return 0;
  } else {
    return todos[todos.length - 1].id;
  }
}

function isEmptyInput(input) {
  return input.value === "";
}

function addTodoToMassive() {
  const input = document.getElementById("todoInput");

  if (isEmptyInput(input)) {
    return;
  }

  trackedSettings.newTodo = input.value;

  const id = getLastId() + 1;
  const newTodo = {
    id: id,
    title: trackedSettings.newTodo,
    completed: false,
  };

  todos.push(newTodo);

  input.value = "";
  trackedSettings.newTodo = "";
  renderTodos();
}

function removeTodo(index) {
  const todo = getTodo(index);
  const todoId = todos.indexOf(todo);

  todos.splice(todoId, 1);
  renderTodos();
}

function renderTodos(filtredTodos = todos) {
  const container = document.getElementById("todoList");

  container.innerHTML = "";

  filtredTodos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";
    todoItem.innerHTML = `
    <div class="todo-checkbox">
      <input id="todo_${
        todo.id
      }" class="todo-checkbox" type="checkbox" onChange="toggleTodo(${
      todo.id
    })" ${todo.completed ? "checked" : ""} />
    <label for="todo_${todo.id}">
        <div id="tick_mark_${todo.id}"></div>
    </label>
    </div>
      <label id="todoLabel_${todo.id}" for="todo_${todo.id}" >${
      todo.title
    }</label>
      <button class="btn btn-danger" onclick="removeTodo(${
        todo.id
      })">Удалить</button>
    `;
    container.appendChild(todoItem);
  });
}

renderTodos();
