import React from "react";
import { Layout } from "antd";
import { Provider } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import Master from "./components/containers/Master";

import "./App.css";
import rootStores from "./stores";

function App() {
  return (
    <BrowserRouter>
      <Master />
    </BrowserRouter>
  );
}

export default App;
