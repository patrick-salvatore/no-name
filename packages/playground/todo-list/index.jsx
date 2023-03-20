import { render, signal, ref, For } from "@lnl/framework";


const initial = [{
  id: 1,
  title: 'Eay'
}, {
  id: 2,
  title: 'Sleep'
}, {
  id: 3,
  title: 'Ski'
}]

let todoId = initial.length

export const Component = () => {
  const [todos, setTodos] = signal(initial)
  const [selected, setSelected] = signal()
  let inputRef = ref()

  const updateInput = (e) => {
    e.preventDefault()

    setTodos((todos) => [...todos, {
      id: ++todoId,
      title: inputRef.current.value
    }]);

    inputRef.current.value = ''
  }

  return (
    <div class="card">
      <form onSubmit={updateInput}>
        <input ref={inputRef} type="text" />
      </form>
      <ul>
        <For list={todos}>
          {(todo) => (<li style={{[selected]: 'background-color:blue'}}>{todo.title}</li>)}
        </For>
      </ul>
    </div>
  );
};

render(<Component />, document.getElementById("app"));
