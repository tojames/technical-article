import React, { useState } from "react";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [first, setfirst] = useState("");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{first}</p>
        <p>
          <li onClick={() => setfirst("dsfdsdff")}>
            @typescript-eslint/eslint-plugin
          </li>
          <li>@typescript-eslint/parser</li>
          <li>eslint</li>
          <li>eslint-plugin-import</li>
          <li>eslint-plugin-promise </li>
          <li>eslint-plugin-react </li>
          <li>eslint-plugin-react-hooks </li>
          <li> typescript </li>

          <li>prettier</li>
          <li> 解决冲突ts： tslint-config-prettier</li>
          <li> 解决冲突js： eslint-config-prettier</li>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
