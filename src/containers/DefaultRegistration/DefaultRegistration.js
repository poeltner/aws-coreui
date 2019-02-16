import React, { Component } from 'react';
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../utils/Logger/Log';
import DefaultLayout from '../DefaultLayout/DefaultLayout';
import DefaultRegisterTenant from './DefaultRegisterTenant';
import DefaultRegisterUser from './DefaultRegisterUser';
import ability from '../../utils/Casl/ability'
import DefaultPage401 from '../DefaultLayout/DefaultPage401/DefaultPage401';
import i18n from '../../i18n';

class DefaultRegistration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRegistered: false,
      isLoading: true,
      isDeactivated: false
    }

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    let selfData = null;
    try {
      selfData = await API.graphql(graphqlOperation(MeData));
    } catch(error) {
      console.log("error" + JSON.stringify(error.errors[0].message,3,3));
      if (error.errors[0].message === "DEACTIVATED") {
        this.setState({isLoading:false, isDeactivated:true});
      }
      return;
    }
    if (selfData.data.me !== null) {
        this.setState({isRegistered: true});
        if (selfData.data.me.user.language !== localStorage.getItem('i18nextLng')) {
          i18n.changeLanguage(selfData.data.me.user.language);
          Log.debug(`Set language to ${selfData.data.me.user.language}`, 'DefaultRegistration');
        }
        let tenant = localStorage.getItem('tenant');
        console.log("tenatn " + tenant);
        const tenantsList = [];
        for (let i = 0; i < selfData.data.me.user.tenants.length; i+=1) { 
          if (selfData.data.me.user.tenants[i].tenant !== null) {
            tenantsList.push(selfData.data.me.user.tenants[i]);
          }  
          
        }
        console.log("tenants " + JSON.stringify(tenantsList));
        // Checks if the user has access to tenants
        if ((tenantsList !== undefined) && (tenantsList.length > 0)) {
          // Checks if there is a prefered tenant
          console.log(1);
          if ((tenant !== null) && (tenant !== '')) {
            console.log(2);
            for (let i = 0; i < tenantsList.length; i+=1) {
              console.log(3 + tenantsList[i].tenantId);
              if (tenantsList[i].tenantId === tenant) {
                console.log(4);
                this.setRules(tenantsList[i]);
                this.setState({isLoading: false, hasTenant: true});
                return;
              }
            }
          // Otherwise takes the first one
          } 
            console.log(5);
            tenant = tenantsList[0].tenantId;
            await localStorage.setItem('tenant', tenant);
            window.location.reload();
            this.setRules(tenantsList[0]);
            this.setState({isLoading: false, hasTenant: true});
          
        } else {
          console.log(6);
          await localStorage.setItem('tenant','');
          this.setState({hasTenant: false});
        }
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'DefaultRegistration.DefaultRegistration');
  }

  setRules(userTenant) {
    console.log('a1' + JSON.stringify(userTenant));
    if (userTenant.tenant.subscription !== null) {
      console.log('a2');
      const rulesData = JSON.parse(userTenant.tenant.subscription.subscription.rules);
      console.log('a2.1' + JSON.stringify(rulesData));
      const role = userTenant.role;
      const isAdmin = userTenant.isAdmin;
      console.log('a2.12');
      if (role === undefined) {
        Log.warn(`User has no role for this tenant`, 'DefaultRegistration');
        throw Error('User has no role for this tenant');
      }
      if (rulesData[role] === undefined) {
        throw Error('Please ask the tenant admin to get new role')
      }
      let rules = [...rulesData[role]];
      console.log('a4');
      if (isAdmin) {
        Log.debug(`Admin rules loaded `, 'App');
        rules = [...rules, ...rulesData['isAdmin']];
      }
      Log.debug(`Rules applied ${JSON.stringify(rules)}`, 'App');
      console.log('a6');
      ability.update(rules);
    }
  }

  render() {

    if (this.state.isLoading) {
        return (
            <div className="animated fadeIn pt-3 text-center">Loading...</div>
        );
    }

    if (this.state.isDeactivated) {
      return (
          <DefaultPage401 />
      );
    }
    
    if (this.state.isRegistered) {
        if (this.state.hasTenant) {
          return (
            <DefaultLayout />
          );
        } else {
          return (
            <DefaultRegisterTenant reload={this.loadData} />
          );
        }
    } else {
        return (
          <DefaultRegisterUser reload={this.loadData} />
        );
    }
  }
}

export default DefaultRegistration;


const MeData = `query Me {
  me {
      userId
      user {
        id
        firstName
        lastName
        email
        status
        language

        tenants {
          tenantId
          role
          isAdmin
          tenant {
            id
            name

            subscription {
              id
              rules
              subscription {
                name
                rules
              }
            }
          }
        }
      }
  }
}`;
