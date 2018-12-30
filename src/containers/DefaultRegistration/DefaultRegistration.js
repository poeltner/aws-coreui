import React, { Component } from 'react';
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../utils/Logger/Log';
import DefaultLayout from '../DefaultLayout/DefaultLayout';
import DefaultRegisterTenant from './DefaultRegisterTenant';

class DefaultRegistration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRegistered: false,
      isLoading: true
    }
  }

  async componentDidMount() {
    const selfData = await API.graphql(graphqlOperation(MeData));
    if (selfData.data.me !== null) {
        this.setState({isRegistered: true})
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'DefaultRegistration.DefaultRegistration');
  }


  render() {

    if (this.state.isLoading) {
        return (
            <div className="animated fadeIn pt-3 text-center">Loading...</div>
        );
    }
    
    if (this.state.isRegistered) {

        return (
            <DefaultLayout />
        );
    } else {
        return (
            <DefaultRegisterTenant />
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
      }
  }
}`;
