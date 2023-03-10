import { render } from "@lnl/framework/vdom";

export const Static = () => {
  return <div class="card">Hello World</div>;
};

render(<Static />, document.getElementById("app"));
