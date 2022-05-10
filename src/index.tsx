import ReactDOM from "react-dom";
import App from "./App";
import { StateProvider } from "./state/state";
import MyTheme from "./MyTheme/MyTheme";

ReactDOM.render(
  <MyTheme>
    <StateProvider>
      <App />
    </StateProvider>
  </MyTheme>,
  document.getElementById("root")
);
