"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "next_todos_v1";

export default function Page() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | completed
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTodos(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {}
  }, [todos]);

  const remaining = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  const filteredTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [filter, todos]);

  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
  }

  function onSubmit(e) {
    e.preventDefault();
    const value = inputRef.current?.value || "";
    addTodo(value);
    if (inputRef.current) inputRef.current.value = "";
  }

  function toggle(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function remove(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  function markAll(complete) {
    setTodos((prev) => prev.map((t) => ({ ...t, completed: complete })));
  }

  return (
    <section className="card">
      <form onSubmit={onSubmit} className="add">
        <input ref={inputRef} className="input" placeholder="Add a new task..." aria-label="Add a new task" />
        <button className="btn" type="submit" aria-label="Add">Add</button>
      </form>

      <div className="toolbar">
        <span>{remaining} {remaining === 1 ? "item" : "items"} left</span>
        <div className="filters" role="tablist" aria-label="Filters">
          <button className={filter === "all" ? "chip active" : "chip"} onClick={() => setFilter("all")}>All</button>
          <button className={filter === "active" ? "chip active" : "chip"} onClick={() => setFilter("active")}>Active</button>
          <button className={filter === "completed" ? "chip active" : "chip"} onClick={() => setFilter("completed")}>Completed</button>
        </div>
        <div className="bulk">
          <button className="link" onClick={() => markAll(true)}>Mark all done</button>
          <button className="link" onClick={() => markAll(false)}>Mark all not done</button>
          <button className="link danger" onClick={clearCompleted}>Clear completed</button>
        </div>
      </div>

      <ul className="list" aria-live="polite">
        {filteredTodos.length === 0 && (
          <li className="empty">No tasks here. Add one above!</li>
        )}
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={"item" + (todo.completed ? " done" : "")}> 
            <label className="checkbox">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggle(todo.id)}
                aria-label={todo.completed ? "Mark as not completed" : "Mark as completed"}
              />
              <span />
            </label>
            <span className="text" onDoubleClick={() => toggle(todo.id)}>{todo.text}</span>
            <button className="icon" onClick={() => remove(todo.id)} aria-label="Delete">
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
