/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col, Input, Label, FormFeedback } from 'reactstrap';
import { API, graphqlOperation } from "aws-amplify";
// import PropTypes from "prop-types";
import { withNamespaces } from 'react-i18next';
import Log from '../../../utils/Logger/Log';

class UserInviteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tenant: this.props.tenant,
      modal: false,
      isLoading: true,
      validate: {},
      roles: []
    };    

    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClickInvite = this.onClickInvite.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this);
    this.loadData();
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  async loadData () {
    this.setState({isLoading: true});
    const selfData = await API.graphql(graphqlOperation(MeData, { tenant: this.state.tenant}));
    Log.info('Response from API ' + JSON.stringify(selfData),'Admin.UserInviteModal');

    if ((selfData.data.me.user.tenants !== null) 
      && (selfData.data.me.user.tenants[0].tenantId === this.state.tenant)) {
        this.setState({
            roles:  selfData.data.me.user.tenants[0].tenant.tenantRoles || [],
        })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.BillingAddressModal');
  }

  async onClickInvite() {

    if (this.state.validate.emailState === 'has-success') {
      this.setState({isLoadingInvite: true});
      const response = await API.graphql(graphqlOperation(InviteUser, { tenant: this.state.tenant, email: this.state.email, role: this.state.role, isAdmin: this.state.isAdmin || false}));
      Log.info(`Email added: ${JSON.stringify(response)}`);
      this.setState({
        isLoading: false,
        email: '',
        isAdmin: false,
        role: '',
        validate: {
          emailState: ''
        }
      });
      this.props.reload();
      this.toggle();
    }
    this.setState({isLoadingInvite: false});
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  async handleInputChange(e) {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [ name ]: value,
    });
  }

  validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
    if (emailRex.test(e.target.value)) {
      validate.emailState = 'has-success';
    } else {
      validate.emailState = 'has-error';
    }
    this.setState({ validate })
  }

  async validateMinCharacter(e, characters) {
    const { validate } = this.state
    if (e.target.value.length >= characters) {
      validate[e.target.name] = 'has-success';
    } else {
      validate[e.target.name] = 'has-error';
    }
    this.setState({ validate })
  }


  render() {
    const { t } = this.props;
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><strong>{ t('Invite new user to tenant') }</strong></ModalHeader>
          <ModalBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('Email')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="email" 
                  id="select" 
                  value={this.state.email || ''}
                  onChange={ (e) => {
                    this.validateEmail(e)
                    this.handleInputChange(e)
                  }}
                  placeholder="myemail@email.com"
                  valid={ this.state.validate.emailState === 'has-success' }
                  invalid={ this.state.validate.emailState === 'has-error' }
                />
                <FormFeedback>
                  { t('A valid email address is required')}
                </FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="role" className="pr-1">{ t('Role')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="select" 
                  name="role" 
                  id="role" 
                  value={this.state.role || ''}
                  onChange={ (e) => {
                    this.validateMinCharacter(e,1)
                    this.handleInputChange(e)
                  }}
                  valid={ this.state.validate.role === 'has-success' }
                  invalid={ this.state.validate.role === 'has-error' }
                >
                <option value="">Select Role</option>
                { this.state.roles.map((role) => {
                  return (
                    <option value={role.name} key={role.name}>{role.name} ({role.max - (role.inUse || 0)})</option>
                  );
                })}
                </Input>
                <FormFeedback>
                  { t('A role need to be selected')}
                </FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="isAdmin" className="pr-1">{ t('Is Admin')}:</Label>
              </Col>
              <Col  xs={{size: 12, offset: 1}} md={{size: 8, offset: 1}}>
                <Input 
                  type="checkbox" 
                  name="isAdmin" 
                  id="isAdmin" 
                  defaultChecked={this.state.isAdmin || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={this.state.isLoadingInvite} onClick={() => this.onClickInvite()}>{ t('common:Invite') }{' '} 
              { (this.state.isLoadingInvite) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
            <Button color="secondary" onClick={this.toggle}>{ t('common:Cancel') }</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('layout') (UserInviteModal);

const MeData = `query Me($tenant: String) {
  me {
      userId
      user {
        id
        firstName
        lastName
        email

        tenants(tenant: $tenant) {
          tenantId
          tenant {
            id
            name

            tenantRoles {
              name
              inUse
              max
            }
          }
        }
      }
  }
}`;

const InviteUser = `mutation inviteUser($tenant: ID!, $email: String!, $role: String, $isAdmin: Boolean) {
    inviteUser(tenant: $tenant, email: $email, role: $role, isAdmin: $isAdmin) {
    id
    email
    status
  }
}`