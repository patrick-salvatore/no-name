import { render, signal } from "@lnl/framework";

export const Interactive = () => {
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
render(<Interactive />, document.getElementById("app"));

export const Static = () => {
  return (
    <div class="card">
      <button id="counter" type="button">
        count is {0}
      </button>
    </div>
  );
};

render(<Static />, document.getElementById("app"));
