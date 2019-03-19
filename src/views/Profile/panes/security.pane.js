import React, { Component } from 'react';
import { Col, Row, FormGroup, Label, Input, Button } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../../utils/Logger/Log';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { withAlert } from '../../../utils/Alert/alert';

class SecurityPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      identities: [],
      isFacebookloading: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onUnlinkFacebook = this.onUnlinkFacebook.bind(this);
    this.onLinkFacebook =  this.onLinkFacebook.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  async componentDidMount() {
    this.loadData();

    Log.info('Self loaded ' + JSON.stringify(this.state), 'Profile.SecurityPane');
    if (!window.FB) this.createScript();
  }

  async loadData() {
    for (let i = 0; i < this.state.identities.length; i += 1) {
      const identity = this.state.identities[i];
      const stateIdent = {};
      stateIdent[identity.provider] = '';
      this.setState(stateIdent)
    }
    const selfData = await API.graphql(graphqlOperation(MeData));
    this.setState({ 
      id: selfData.data.me.userId,
      firstName: selfData.data.me.user.firstName,
      lastName: selfData.data.me.user.lastName,
      email: selfData.data.me.user.email,
      identities: selfData.data.me.user.identities,
    });

    for (let i = 0; i < selfData.data.me.user.identities.length; i += 1) {
      const identity = selfData.data.me.user.identities[i];
      const stateIdent = {};
      stateIdent[identity.provider] = identity.identityId;
      this.setState(stateIdent)
    }
  }

  async onSubmit() {
    const meData = await API.graphql(graphqlOperation(
      UpdateMe,
      {
        id: this.state.id,
        input: {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
        } 
      },
    ));
    Log.info("Submit response: " + JSON.stringify(meData), "Profile.EditView");
  }
  
  async onSubmitChangePassword() {
    Auth.currentAuthenticatedUser()
      .then(user => {
          return Auth.changePassword(user, this.state.currentPassword, this.state.newPassword);
      })
      .then(data => this.props.alert(JSON.stringify(data)))
      .catch(err => this.props.error(JSON.stringify(err)));
  }


  handleInputChange(e) {
    let input = [];
    input[e.target.name] = e.target.value;
    this.setState(input);
    Log.info('Input changed ' + JSON.stringify(this.state), 'Profile.EditView');
  }


  async onLinkFacebook() {
    
      const fb = window.FB;
      fb.getLoginStatus(response => {
          if (response.status === 'connected') {
              this.linkProvider(response.authResponse.accessToken);
          } else {
              fb.login(
                  response => {
                      if (!response || !response.authResponse) {
                          return;
                      }
                      // this.getAWSCredentials(response.authResponse);
                      console.log("response2 " + JSON.stringify(response))
                      this.linkProvider(response.authResponse.accessToken);
                  },
                  {
                      // the authorized scopes
                      scope: 'public_profile,email'
                  }
              );
          }
      });
      this.setState({isFacebookloading:false});
  }

  async linkProvider(userid) {
    this.setState({isFacebookloading:true});
    const meData = await API.graphql(graphqlOperation(
      LinkProvider,
      {
        provider: 'graph.facebook.com',
        userid
      },
    ));
    this.loadData();
    this.setState({isFacebookloading:false});
    console.log("data " + JSON.stringify(meData));
  }

  async onUnlinkFacebook(identity) {
    this.setState({isFacebookloading:true});
    const meData = await API.graphql(graphqlOperation(
      UnlinkProvider,
      {
        identity
      },
    ));
    this.loadData();
    console.log("data " + JSON.stringify(meData));
    this.setState({isFacebookloading:false});
  }

  createScript() {
    // load the sdk
    window.fbAsyncInit = this.fbAsyncInit;
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.onload = this.initFB;
    document.body.appendChild(script);
}

  initFB() {
      // const fb = window.FB;
      console.log('FB SDK inited');
  }

  fbAsyncInit() {
      // init the fb sdk client
      const fb = window.FB;
      fb.init({
          appId   : '1112955052195883',
          cookie  : true,
          xfbml   : true,
          version : 'v2.11'
      });
  }
    
  render() {
    const { t } = this.props;
    

    return (
      <div className="animated fadeIn">
            <Row>
              <Col>
                <h5><strong>{ t('Change Password')}</strong></h5><br/>
              </Col>
            </Row>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="currentPassword" className="pr-1">{ t('CurrentPassword')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={this.state.currentPassword}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="newPassword" className="pr-1">{ t('NewPassword')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={this.state.newPassword}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <Row>
              <Col>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button className="float-right" onClick={() => this.onSubmitChangePassword() } color="primary"> Change Password </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                &nbsp;
              </Col>
            </Row>
            <Row>
              <Col>
                &nbsp;
              </Col>
            </Row>
            <Row>
              <Col>
                <h5><strong>{ t('Change Email')}</strong></h5><br/>
              </Col>
            </Row>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="email" className="pr-1">{ t('common:Email')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input
                  type="text"
                  name="email"
                  id="select"
                  value={this.state.email}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <Row>
              <Col>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button className="float-right" onClick={() => this.onSubmitChangePassword() } color="primary"> Change Password </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                &nbsp;
              </Col>
            </Row>
            <Row>
              <Col>
                &nbsp;
              </Col>
            </Row>
            <Row>
              <Col>
                <h5><strong>{ t('LinkedAccounts')}</strong></h5><br/>
              </Col>
            </Row>
            <Row className="pr-1">
              <Col md="3">
                <Label htmlFor="email" className="pr-1">{ t('common:Facebook')}:</Label>
              </Col>
              <Col xs="12" md="9">
                { (this.state['graph.facebook.com']) ? 
                  <Button size="sm" onClick={() => this.onUnlinkFacebook(this.state['graph.facebook.com']) } color="warning"> Unlink Facebook{' '} 
                  { (this.state.isFacebookloading) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
                :
                  <Button size="sm" onClick={() => this.onLinkFacebook() } color="primary"> Link Facebook{' '} 
                  { (this.state.isFacebookloading) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
                }
              </Col>
            </Row>
      </div>
    );
  }
}

SecurityPane.propTypes = {
  t: PropTypes.any,
  alert: PropTypes.func,
  error: PropTypes.func,
}

export default withNamespaces('view_profile') (withAlert(SecurityPane));

const UpdateMe = `mutation UpdateUser($id: ID!, $input: UserInput!) {
  updateUser(id: $id, input: $input) {
    id
    firstName
    lastName
    email

    tenants {
      tenantId

      tenant {
        id
        name
      }
    }
  }
}`;

const LinkProvider = `mutation LinkProvider($provider: String, $userid: String) {
  linkProvider(provider: $provider, userid: $userid) {
    id
    firstName
    lastName
    email
  }
}`;

const UnlinkProvider = `mutation UnlinkProvider($identity: String) {
  unlinkProvider(identity: $identity) {
    id
    firstName
    lastName
    email
  }
}`;

const MeData = `query Me {
  me {
      userId
      user {
        id
        firstName
        lastName
        email

        identities {
          identityId
          provider
        }
      }
  }
}`;
