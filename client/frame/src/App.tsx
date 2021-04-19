import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import MessageBoxProvider from './MessageBoxProvider';
import MessageBox from './ui/MessageBox';
import IndexView from './views/IndexView';
import LoginView from './views/LoginView';

function App(): JSX.Element {
  return (
    <MessageBoxProvider>
      <MessageBox />
      <Router>
        <Switch>
          {/* <Route path='/packages'/>
          <Route path='/package/:id'/> */}
          <Route path='/login' exact component={LoginView}/>
          <Route path='/' exact component={IndexView}/>
        </Switch>
      </Router>
    </MessageBoxProvider>
  );
}

export default App;
