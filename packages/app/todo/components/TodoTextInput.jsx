import { addTodo } from '../store'

const UUID = () => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const TodoTextInput = (props) => {
  return (
    <input
      class={{
        edit: props.editing,
        'new-todo': props.newTodo
      }}
      type="text"
      placeholder={props.placeholder}
      autoFocus="true"
      value={''}
      onKeyPress={function _(e) {
        if (e.key === 'Enter' && e.target.value.trim().length > 0) {
          addTodo({
            bodyText: e.target.value,
            completed: false,
            id: UUID(),
          })
          e.target.value = ''
        }
      }}
    />
  )

}


export default TodoTextInput
