import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "normalize.css";
import * as serviceWorker from "./serviceWorker";
import "./index.css";


// disable page scroll when pressing space and arrow keys
window.addEventListener(
    "keydown",
    function (e) {
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    },
    false
);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
