export const useStore = () => ({
  todos: [
    {
      text: "Go workout",
      completed: false,
      id: 0
    },
    {
      text: "Give eat & educate talk",
      completed: false,
      id: 0
    },
    {
      text: "Learn something new",
      completed: true,
      id: 0
    },
    {
      text: "Build a cool product",
      completed: false,
      id: 0
    }
  ],
  visibilityFilter: "All"
});

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
