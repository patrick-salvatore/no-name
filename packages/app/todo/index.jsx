import { render } from "@lnl/framework";

import TodoList from "./components/TodoList";
import TodoTextInput from "./components/TodoTextInput";
import FilterButton from "./components/FilterButton";

const FILTER_TITLES = ["All", "Active", "Completed"];

// const Footer = (props) => {
//   const itemWord = props.activeCount === 1 ? "item" : "items";

//   const todosCount = () => useStore().todos.length;

//   return (
//     <footer class="footer">
//       <span class="todo-count">
//         <strong>{todosCount() - getCompletedCount(useStore().todos) || "No"}</strong> {itemWord}{" "}
//         left
//       </span>
//       <ul class="filters">
//         {FILTER_TITLES.map((filter) => (
//           <li key={filter}>
//             <FilterButton filter={filter}>{filter}</FilterButton>
//           </li>
//         ))}
//       </ul>
//       {!!props.completedCount && (
//         <button class="clear-completed" onClick={props.onClearCompleted}>
//           Clear completed
//         </button>
//       )}
//     </footer>
//   );
// };

const App = () => {
  return (
    <div class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <TodoTextInput newTodo={true} placeholder="What needs to be done?" />
      </header>
      <section class="main">
        <TodoList />
        {/* {!!useStore().todos.length && <Footer />} */}
      </section>
    </div>
  );
};

render(<App />, document.getElementById("app"));
