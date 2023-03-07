import { render } from "@lnl/framework";

import { useStore, getCompletedCount } from './store'

const App = () => {
  function increment() { }
  function decrement() { }

  return (
    <div>
      Count: {count()}

      <button onClick={increment}></button>
      <button onClick={decrement}></button>
    </div>
  )
};

render(<App />, document.getElementById("app"));
