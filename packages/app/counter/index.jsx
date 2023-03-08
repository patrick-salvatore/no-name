import { render, signal } from "@lnl/framework";

import { useStore, getCompletedCount } from "./store";

const App = () => {
  const [count, setCount] = signal(0);
  const [name, setName] = signal(0);

  return (
    <button id="counter" type="button" onClick={() => setCount((c) => c + 1)}>
      count is {count}
    </button>
  );
  // return (
  //   <div>
  //     <h1>Hello World!</h1>
  //     <div class="card">
  //       <button id="counter" type="button" onClick={() => console.log(count())}>
  //         count is {count()}
  //       </button>
  //     </div>
  //     <div class="card">
  //       <h1 id="name">My name is {name}</h1>
  //       <input onChange={(e) => console.log(e)} />
  //     </div>
  //   </div>
  // );
};

render(<App />, document.getElementById("app"));
