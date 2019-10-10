import React from "react";
import Home from "./Home";
import { StoreProvider } from "./Store";

function App() {
  return (
    <StoreProvider>
      <Home />
    </StoreProvider>
  );
}

export default App;
