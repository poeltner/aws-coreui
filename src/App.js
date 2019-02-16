/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import './App.scss';

//AWS Amplify
import Amplify from "aws-amplify";
import { VerifyContact, withAuthenticator } from 'aws-amplify-react';
import { DefaultConfirmSignIn, DefaultConfirmSignUp, DefaultForgotPassword, DefaultSignUp, DefaultSignIn, DefaultRequireNewPassword} from './containers/DefaultAuth'
import aws_exports from './aws-exports';

// import ability from './utils/Casl/ability'
// import Log from './utils/Logger/Log';
import DefaultPage401 from './containers/DefaultLayout/DefaultPage401/DefaultPage401';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;


const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});

const DefaultRegistration = Loadable({
  loader: () => import('./containers/DefaultRegistration/DefaultRegistration'),
  loading
});

Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLaoding: true,
    }
  }

  // componentDidMount() {
  //   // this.loadData();
  // }

  // async loadData () {
  //   let tenant = localStorage.getItem('tenant');
  //   this.setState({isLoading: true});
  //   let selfData = {};
  //   if ((tenant === null) || (tenant === '')) {
  //     selfData = await API.graphql(graphqlOperation(MeData));
  //     tenant = selfData.data.me.user.tenants[0].tenantId;
  //     localStorage.setItem('tenant', tenant);
  //     window.location.reload();
  //   } else {
  //     selfData = await API.graphql(graphqlOperation(MeData, { tenant: tenant}));

  //     if (selfData.data.me === null) {
  //       localStorage.setItem(tenant, '');
  //       tenant = null;
  //     }
  //   }
  //   if (tenant === null) {
  //     this.setState({ noTenant: true});
  //   } else {
  //     if ((selfData.data.me.user !== undefined) 
  //       && (selfData.data.me.user.tenants !== undefined) 
  //       && (selfData.data.me.user.tenants[0] !== undefined)
  //       && (selfData.data.me.user.tenants[0].tenantId === tenant)) {

  //         if (selfData.data.me.user.tenants[0].tenant.subscription !== null) {
  //           const rulesData = JSON.parse(selfData.data.me.user.tenants[0].tenant.subscription.subscription.rules);
  //           const role = selfData.data.me.user.tenants[0].role;
  //           const isAdmin = selfData.data.me.user.tenants[0].isAdmin;
  //           let rules = [...rulesData[role]];
  //           if (isAdmin) {
  //             Log.debug(`Admin rules loaded `, 'App');
  //             rules = [...rules, ...rulesData['isAdmin']];
  //           }
  //           Log.debug(`Rules applied ${JSON.stringify(rules)}`, 'App');
  //           ability.update(rules);
  //         }
  //     }
  //   }
  //   this.setState({isLoading: false});
  // }
  
  render() {
    // if (this.state.isLoading) {
    //   return "Loading";
    // }
    // if (this.state.noTenant) {
    //   return "No Tenant";
    // }
    return (
      <HashRouter>
          <Switch>
            <Route exact path="/401" name="Page 401" component={DefaultPage401} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <Route path="/" name="Home" component={DefaultRegistration} />
          </Switch>
      </HashRouter>
    );
  }
}

export default withAuthenticator(App, false, [
  <DefaultSignIn federated={aws_exports.federated}/>,
  <DefaultConfirmSignIn/>,
  <VerifyContact/>,
  <DefaultSignUp federated={aws_exports.federated}/>,
  <DefaultConfirmSignUp/>,
  <DefaultForgotPassword/>,
  <DefaultRequireNewPassword/>
]);

// const MeData = `query Me($tenant: String) {
//   me {
//       userId
//       user {
//         id
//         firstName
//         lastName
//         email

//         tenants(tenant: $tenant) {
//           tenantId
//           role
//           isAdmin
//           tenant {
//             id
//             name

//             subscription {
//               id
//               rules
//               subscription {
//                 name
//                 rules
//               }
//             }
//           }
//         }
//       }
//   }
// }`;