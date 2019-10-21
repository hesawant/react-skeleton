require("es6-promise").polyfill();
require("isomorphic-fetch");

import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import App from "./app";

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById("container"),
    );
};

render(App);

if ((module as any).hot) {
    (module as any).hot.accept("./app", () => {
        const NextApp = require("./app").default;
        render(NextApp);
    });
}
