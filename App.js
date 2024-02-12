import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage'; // Your existing home page component
import AboutPage from './AboutPage'; // Your new about page component

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/about" component={AboutPage} />
      </Switch>
    </Router>
  );
}

export default App;
