import { render } from "@lnl/framework";
// import { Router, useRoutes } from "solid-app-router";

import Nav from "./components/nav";

// import routes from "./routes";

// const Outlet = useRoutes(routes);

render(
  () => (
    // <Router routes={routes} root={process.env.PUBLIC_URL}>
    <Nav />
    // <Outlet />
    // </Router>
  ),
  document.body
);
