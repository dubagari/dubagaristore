import React from "react";
import ReactDOM from "react-dom/client";
import "../src/index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";

import store from "./store/Store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
