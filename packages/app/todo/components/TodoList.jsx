import { effect, For } from "@lnl/framework";

import { store } from "../store";

import TodoItem from "./TodoItem";

const TodoList = () => {
  return (
    <ul class="todo-list">
      <For each={store[0]()}>
        {(todo) => {
          return <TodoItem todo={todo} />;
        }}
      </For>
      {/* {useStore().todos.map()} */}
    </ul>
  );
};

export default TodoList;
