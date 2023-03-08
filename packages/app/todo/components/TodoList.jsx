
import { effect } from '@lnl/framework';
import { getFilteredTodos, useStore } from '../store'

import TodoItem from "./TodoItem";

const TodoList = () => {
  return (
    <ul class="todo-list">
      {useStore().todos.map((todo) => {
        return <TodoItem todo={todo}/>
      })}
    </ul>
  );
};

export default TodoList;

