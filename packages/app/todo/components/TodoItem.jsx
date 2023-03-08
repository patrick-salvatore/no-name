import TodoTextInput from "./TodoTextInput";

const TodoItem = (props) => {

  const handleDoubleClick = () => { };

  const handleSave = (id, text) => { };

  const completeTodo = (todo) => { }

  const deleteTodo = (todo) => { }

  return (
    <li
      class={{
        completed: props.todo.completed,
        editing: props.todo.editing
      }}
    >
      {props.todo.editing ? (
        <TodoTextInput
          text={props.todo.text}
          editing={props.todo.editing}
          onSave={text => handleSave(props.todo.id, text)}
        />
      ) : (
        <div class="view">
          <input
            class="toggle"
            type="checkbox"
            checked={props.todo.completed}
            onChange={() => completeTodo(props.todo)}
          />
          <label onDoubleClick={handleDoubleClick}>{props.todo.text}</label>
          <button class="destroy" onClick={() => deleteTodo(props.todo.id)} />
        </div>
      )}
    </li>
  );

}

export default TodoItem
