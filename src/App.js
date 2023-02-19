import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Songs from "./components/Songs";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Songs} />
        </Switch>
      </Router>
    );
  }
}

export default App;
