const STORAGE_KEY = "todos";

const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const clearDoneBtn = document.getElementById("clear-done-btn");

let todos = loadTodos();

function loadTodos() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage unavailable (e.g. private mode) — tasks just won't persist.
  }
}

function render() {
  list.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-check";
    checkbox.checked = !!todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const span = document.createElement("span");
    span.className = "todo-text";
    if (todo.done) span.classList.add("done");
    span.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "Löschen";
    del.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, span, del);
    list.appendChild(li);
  });

  // Button nur zeigen, wenn es erledigte Aufgaben gibt
  clearDoneBtn.hidden = !todos.some((t) => t.done);
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), text, done: false });
  saveTodos();
  render();
  input.value = "";
  input.focus();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

// Alle erledigten Aufgaben auf einmal entfernen
// (alte Aufgaben ohne "done" gelten als nicht erledigt und bleiben)
function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  saveTodos();
  render();
}

addBtn.addEventListener("click", addTodo);
clearDoneBtn.addEventListener("click", clearCompleted);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

render();

// Dunkler Modus: Umschalter und gespeicherte Auswahl
const THEME_KEY = "theme";
const themeBtn = document.getElementById("theme-btn");

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeBtn.textContent = dark ? "Heller Modus" : "Dunkler Modus";
  themeBtn.setAttribute("aria-pressed", String(dark));
}

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "dark";
  } catch {
    return false;
  }
}

function saveTheme(dark) {
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
    // Speicher nicht verfügbar — Auswahl gilt nur bis zum Neuladen.
  }
}

themeBtn.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");
  applyTheme(dark);
  saveTheme(dark);
});

applyTheme(loadTheme());
