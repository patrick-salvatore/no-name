
import { getFilteredTodos, useStore } from '../store'

import TodoItem from "./TodoItem";

const TodoList = () => {
  const { visibilityFilter, todos } = useStore();

  return (
    <ul class="todo-list">
      {getFilteredTodos(visibilityFilter, todos).map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;
