import { render, signal } from "@lnl/framework";

// const App = () => {
//   const [count, setCount] = signal(0);
//   const [emoji, setEmoji] = signal();

//   return (
//     <div>
//       <h1>Hello World!</h1>
//       <div class="card">
//         <button id="counter" type="button" onClick={() => setCount((c) => c + 1)}>
//           count is {count}
//         </button>
//       </div>
//       <div class="card">
//         <h1 id="name">Favorite Food {emoji}</h1>
//         <button type="button" onClick={() => setEmoji("🍔")}>🍔</button>
//         <button type="button" onClick={() => setEmoji("🌭")}>🌭</button>
//         <button type="button" onClick={() => setEmoji("🍕")}>🍕</button>
//         <button type="button" onClick={() => setEmoji("🌮")}>🌮</button>
//       </div>
//     </div>
//   );
// };


const App = () => {
  const [count, setCount] = signal(0);

  return (
    <button id="counter" type="button" onClick={() => setCount((c) => c + 1)}>
      count is {count}
    </button>
  );
};

render(<App />, document.getElementById("app"));
