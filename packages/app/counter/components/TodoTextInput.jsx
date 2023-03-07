const TodoTextInput = ({ editing, newTodo, placeholder }) => {

  const handleSubmit = e => { }

  const handleChange = e => { }

  const handleBlur = e => { }

  return (
    <input
      class={{
        edit: editing,
        'new-todo': newTodo
      }}
      type="text"
      placeholder={placeholder}
      autoFocus="true"
      value={''}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleSubmit}
    />
  )

}


export default TodoTextInput