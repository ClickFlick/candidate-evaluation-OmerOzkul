import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { makeServer } from "./server";
import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./contexts/DataProvider.js";
import { AuthProvider } from "./contexts/AuthProvider.js";
import { UserProvider } from "./contexts/UserDataProvider.js";
import { AddressProvider } from "./contexts/AddressProvider.js";
import { TokenProvider } from "./contexts/TokenProvider.js";

// Call make Server
makeServer();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <TokenProvider>
          <DataProvider>
            <UserProvider>
              <AddressProvider>
                <App />
              </AddressProvider>
            </UserProvider>
          </DataProvider>
        </TokenProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
