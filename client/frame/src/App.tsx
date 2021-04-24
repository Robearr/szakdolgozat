import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import MessageBoxProvider from './MessageBoxProvider';
import AuthMiddleware from './middlewares/AuthMiddleware';
import Menu from './ui/Menu';
import MessageBox from './ui/MessageBox';
import IndexView from './views/IndexView';
import LoginView from './views/LoginView';
import PackagesView from './views/PackagesView';
import PackageView from './views/PackageView';
import StatisticsView from './views/StatisticsView';

function App(): JSX.Element {
  return (
    <MessageBoxProvider>
      <MessageBox />
      <Router>
        <Menu>
          <Switch>
            <Route path='/statistics' exact>
              <AuthMiddleware isTeacherRoute={true}>
                <StatisticsView />
              </AuthMiddleware>
            </Route>
            <Route path='/packages' exact component={PackagesView}/>
            <Route path='/package/:id' component={PackageView} />
            <Route path='/login' exact component={LoginView}/>
            <Route path='/' exact component={IndexView}/>
          </Switch>
        </Menu>
      </Router>
    </MessageBoxProvider>
  );
}

export default App;
