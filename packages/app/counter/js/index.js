import { render, createElement, signal } from "@lnl/framework";

// export const Interactive = () => {
//   const [count, setCount] = signal(0);

//   setInterval(() => {
//     setCount((c) => c + 1);
//   }, 1000);

//   return createElement("div", { class: "card" }, createElement("button", {}, "count is ", count));
// };
// render(createElement(Interactive), document.getElementById("app"));

export const Static = () => {
  return createElement("div", { class: "card" }, createElement("button", {}, "count is ", 0));
};

render(createElement(Static), document.getElementById("app"));
