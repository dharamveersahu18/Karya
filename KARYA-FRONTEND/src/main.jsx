import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.jsx";
import { store } from "./redux/store";
import AuthInitializer from "./components/AuthInitialzer.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
  
        <App />
      </AuthInitializer>
    </Provider>
  </StrictMode>,
);
