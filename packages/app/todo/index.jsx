import { render } from "@lnl/framework";

import { useStore, getCompletedCount } from './store'

import TodoList from "./components/TodoList";
import TodoTextInput from "./components/TodoTextInput";
import FilterButton from "./components/FilterButton";

const Header = () => (
  <header class="header">
    <h1>todos</h1>
    <TodoTextInput
      newTodo
      placeholder="What needs to be done?"
    />
  </header>
);


const FILTER_TITLES = ["All", "Active", "Completed"];

const Footer = props => {
  const itemWord = props.activeCount === 1 ? "item" : "items";

  return (
    <footer class="footer">
      <span class="todo-count">
        <strong>{props.activeCount || "No"}</strong> {itemWord} left
      </span>
      <ul class="filters">
        {FILTER_TITLES.map(filter => (
          <li key={filter}>
            <FilterButton filter={filter}>{filter}</FilterButton>
          </li>
        ))}
      </ul>
      {!!props.completedCount && (
        <button class="clear-completed" onClick={props.onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};


const MainSection = () => {
  const { todos } = useStore();
  const todosCount = todos.length;
  const completedCount = getCompletedCount(todos);

  const completeAllTodos = () => { }

  const clearCompletedTodos = () => { }

  return (
    <section class="main">
      <TodoList />
      {!!todosCount && (
        <Footer
          completedCount={completedCount}
          activeCount={todosCount - completedCount}
          onClearCompleted={clearCompletedTodos}
        />
      )}
    </section>
  );
};

const App = () => (
  <div class='todoapp'>
    <Header />
    <MainSection />
  </div>
);

render(<App />, document.getElementById("app"));
