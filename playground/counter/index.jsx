import { render, signal } from "@lnl/framework";

export const Counter = () => {
  const [count, setCount] = signal(0);

  setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);

  return (
    <div class="card">
      <button id="counter" type="button">
        count is {count}
      </button>
    </div>
  );
};


render(<Counter />, document.getElementById("app"));
