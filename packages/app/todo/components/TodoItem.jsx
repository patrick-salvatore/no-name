import TodoTextInput from "./TodoTextInput";

const TodoItem = ({ todo }) => {
  const editing = false // TODO STATE

  const handleDoubleClick = () => { };

  const handleSave = (id, text) => { };

  const completeTodo = (todo) => { }

  const deleteTodo = (todo) => { }

  return (
    <li
      class={{
        completed: todo.completed,
        editing: editing
      }}
    >
      {editing ? (
        <TodoTextInput
          text={todo.text}
          editing={editing}
          onSave={text => handleSave(todo.id, text)}
        />
      ) : (
        <div class="view">
          <input
            class="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => completeTodo(todo)}
          />
          <label onDoubleClick={handleDoubleClick}>{todo.text}</label>
          <button class="destroy" onClick={() => deleteTodo(todo.id)} />
        </div>
      )}
    </li>
  );

}

export default TodoItem