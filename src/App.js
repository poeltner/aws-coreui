/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

//AWS Amplify
import Amplify from 'aws-amplify';
import { VerifyContact, withAuthenticator } from 'aws-amplify-react';
import { DefaultConfirmSignIn, DefaultConfirmSignUp, DefaultForgotPassword, DefaultSignUp, DefaultSignIn, DefaultRequireNewPassword} from './containers/DefaultAuth'
import aws_exports from './aws-exports';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;


// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

Amplify.configure(aws_exports);

class App extends Component {
  
  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

const signUpConfig = {
  hiddenDefaults: ['phone_number'],
};

export default withAuthenticator(App, false, [
  <DefaultSignIn federated={aws_exports.federated}/>,
  <DefaultConfirmSignIn/>,
  <VerifyContact/>,
  <DefaultSignUp federated={aws_exports.federated} signUpConfig={signUpConfig} />,
  <DefaultConfirmSignUp/>,
  <DefaultForgotPassword/>,
  <DefaultRequireNewPassword/>
]);