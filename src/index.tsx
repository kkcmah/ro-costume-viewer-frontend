import ReactDOM from "react-dom";
import App from "./App";
import { StateProvider } from "./state/state";

ReactDOM.render(
  <StateProvider>
    <App />
  </StateProvider>,
  document.getElementById("root")
);
