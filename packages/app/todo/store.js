import { signal } from "@lnl/framework";

export const store = signal({
  todos: [
    {
      text: "Go workout",
      completed: false,
      id: 0,
      editing: false
    }
    // {
    //   text: "Give eat & educate talk",
    //   completed: false,
    //   id: 1,
    //   editing: false,
    // },
    // {
    //   text: "Learn something new",
    //   completed: true,
    //   id: 2,
    //   editing: false,
    // },
    // {
    //   text: "Build a cool product",
    //   completed: false,
    //   id: 3,
    //   editing: false,
    // }
  ],
  visibilityFilter: "All"
});

export const addTodo = (todo) => {
  store[1]((s) => ({ ...s, todos: [...s.todos, todo] }));
};

export const getCompletedCount = (todos) =>
  todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0);

export const getFilteredTodos = (visibilityFilter, todos) => {
  switch (visibilityFilter) {
    case "All":
      return todos;
    case "Completed":
      return todos.filter((t) => t.completed);
    case "Active":
      return todos.filter((t) => !t.completed);
    default:
      throw new Error("Unknown filter: " + visibilityFilter);
  }
};
