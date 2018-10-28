import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';

//AWS Amplify
import Amplify from 'aws-amplify';
import { VerifyContact, withAuthenticator } from 'aws-amplify-react';
import { DefaultConfirmSignIn, DefaultConfirmSignUp, DefaultForgotPassword, DefaultSignUp, DefaultSignIn, DefaultRequireNewPassword} from './containers/DefaultAuth'
import aws_exports from './aws-exports';

// Containers
import { DefaultLayout } from './containers';
// Pages
import { Login, Page404, Page500, Register } from './views/Pages';

// import { renderRoutes } from 'react-router-config';

Amplify.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/register" name="Register Page" component={Register} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default withAuthenticator(App, false, [
  <DefaultSignIn/>,
  <DefaultConfirmSignIn/>,
  <VerifyContact/>,
  <DefaultSignUp/>,
  <DefaultConfirmSignUp/>,
  <DefaultForgotPassword/>,
  <DefaultRequireNewPassword/>
]);