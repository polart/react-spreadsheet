import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

test("renders app without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
});
