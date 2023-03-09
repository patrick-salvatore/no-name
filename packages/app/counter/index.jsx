import { render, signal } from "@lnl/framework";

const App = () => {
  const [count, setCount] = signal(0);

  return (
    <button id="counter" type="button" onClick={() => setCount((c) => c + 1)}>
      count is {count}
    </button>
  );
};

render(<App />, document.getElementById("app"));
