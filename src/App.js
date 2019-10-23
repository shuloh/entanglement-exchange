import React from "react";
import Home from "./Home";
import { StoreProvider } from "./Store";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline, Container } from "@material-ui/core";
import NavBar from "./NavBar";
import User from "./User";
import About from "./About";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider
} from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import teal from "@material-ui/core/colors/teal";

let theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: teal,
    type: "dark"
  }
});
theme = responsiveFontSizes(theme);

export default function App() {
  return (
    <React.Fragment>
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="xl">
            <Router>
              <NavBar />
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                <Route path="/About">
                  <About />
                </Route>
                <Route path="/User">
                  <User />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Router>
          </Container>
        </ThemeProvider>
      </StoreProvider>
    </React.Fragment>
  );
}
