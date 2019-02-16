/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup, FormFeedback, Col, Input, Label } from 'reactstrap';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { withNamespaces } from 'react-i18next';
import Log from '../../../utils/Logger/Log';

class UsersEditModal extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      tenant: this.props.tenant,
      modal: false,
      isLoading: true,
      input: {
          user: {
              email: ''
          }
      },
      roles: [],
      errorMessage: '',
      roleState: '',
    };    

    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClickUpdate = this.onClickUpdate.bind(this);
    this.onClickDeactiviate = this.onClickDeactiviate.bind(this);
    this.onClickActivate = this.onClickActivate.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  async loadData (userId) {
    this.setState({isLoading: true});
    const selfData = await API.graphql(graphqlOperation(MeData, { userId: userId, tenant: this.state.tenant}));
    Log.info('Response from API ' + JSON.stringify(selfData),'Admin.UserEditModal');

    if ((selfData.data.me.user.tenants !== null) 
      && (selfData.data.me.user.tenants[0].tenantId === this.state.tenant)) {
        this.setState({
          roles:  selfData.data.me.user.tenants[0].tenant.tenantRoles || [],
          input: {
            firstname: selfData.data.me.user.tenants[0].tenant.users.items[0].user.firstname || '',
            lastName: selfData.data.me.user.tenants[0].tenant.users.items[0].user.lastName || '',
            email: selfData.data.me.user.tenants[0].tenant.users.items[0].user.email || '',
            role: selfData.data.me.user.tenants[0].tenant.users.items[0].role,
            isAdmin: selfData.data.me.user.tenants[0].tenant.users.items[0].isAdmin || false,
          },
          isActive: (selfData.data.me.user.tenants[0].tenant.users.items[0].status !== 'DEACTIVATED') ? true : false,
          isLoading: false
        })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.BillingAddressModal');
  }

  async onClickUpdate() {
    this.setState({isLoadingUpdate: true});
    const requestUpdate = {
      userId: this.state.userId,
      role: this.state.input.role,
      isAdmin: this.state.input.isAdmin,
    }
    try {
      const userRole = await API.graphql(graphqlOperation(UpdateUserRole, { tenant: this.state.tenant, input: requestUpdate}));
      Log.info(`Updated user Role ${JSON.stringify(userRole)}`);
      this.props.reload();
      this.toggle();
    } catch(error) {
      if (error.errors[0].message.slice(0,18) === "No availbale roles") {
        this.setState({roleState: 'has-error'});
      }
    }
    this.setState({isLoadingUpdate: false});
  }

  async onClickDeactiviate() {
    this.setState({isLoadingDeactiviate: true});
    const requestUpdate = {
      userId: this.state.userId,
      deactivate: true,
    }
    const userRole = await API.graphql(graphqlOperation(UpdateUserRole, { tenant: this.state.tenant, input: requestUpdate}));
    Log.info(`Updated user Role ${JSON.stringify(userRole)}`);
    this.props.reload();
    this.setState({isLoadingDeactiviate: false});
    this.toggle();
  }

  async onClickActivate() {
    this.setState({isLoadingActivate: true});
    const requestUpdate = {
      userId: this.state.userId,
      deactivate: false,
    }
    const userRole = await API.graphql(graphqlOperation(UpdateUserRole, { tenant: this.state.tenant, input: requestUpdate}));
    Log.info(`Updated user Role ${JSON.stringify(userRole)}`);
    this.props.reload();
    this.toggle();
    this.setState({isLoadingActivate: false});
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  showModal(userId) {
    this.setState({modal:true, isLoading:false, userId});
    this.loadData(userId);
    
  }

  handleInputChange(e) {
    const input = this.state.input;
    if (e.target.type === "checkbox") {
      input[e.target.name] = e.target.checked;
    } else {
      input[e.target.name] = e.target.value;
    }
    this.setState({input});
  }


  render() {
    const { t } = this.props;

    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><strong>{ t('Update user') }</strong></ModalHeader>
          { this.state.isLoading ?
            <div className="animated fadeIn pt-3 text-center">Loading...</div>
            :
          <ModalBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="email" className="pr-1">{ t('User')}:</Label>
              </Col>
              <Col xs="12" md="9">
              { ((this.state.input.firstName !== '') && (this.state.input.lastName !== '')) ?
                <div>
                  <strong>{this.state.input.firstName || ''} {this.state.input.lastName || ''}</strong>
                </div>
                : null
              }
                <div>{this.state.input.email || ''}</div>
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
                  value={this.state.input.role || ''}
                  onChange={this.handleInputChange} 
                  valid={ this.state.roleState === 'has-success' }
                  invalid={ this.state.roleState === 'has-error' }
                >
                { this.state.roles.map((role) => {
                  return (
                    <option value={role.name} key={role.name}>{role.name} ({role.max - (role.inUse || 0)})</option>
                  );
                })}
                </Input>
                <FormFeedback>
                  No role available
                </FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="isAdmin" className="pr-1">{ t('Is Admin')}:</Label>
              </Col>
              <Col xs={{size: 12, offset: 1}} md={{size: 8, offset: 1}}>
                <Input 
                  type="checkbox" 
                  name="isAdmin" 
                  id="isAdmin" 
                  defaultChecked={this.state.input.isAdmin || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
          </ModalBody>
          }
          <ModalFooter>
            <Button color="primary" disabled={this.state.isLoadingUpdate} onClick={() => this.onClickUpdate()}>{ t('common:Change') }{' '} 
              { (this.state.isLoadingUpdate) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
            <Button color="secondary" onClick={this.toggle}>{ t('common:Cancel') }</Button>
            { (this.state.isActive) ? 
            <Button color="danger" disabled={this.state.isLoadingDeactiviate} onClick={this.onClickDeactiviate}>{ t('common:Deactiviate') }{' '} 
            { (this.state.isLoadingDeactiviate) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
            :
            <Button color="danger" disabled={this.state.isLoadingActivate} onClick={this.onClickActivate}>{ t('common:Activate') }{' '} 
            { (this.state.isLoadingActivate) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
            }
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('layout') (UsersEditModal);

const MeData = `query Me($userId: ID, $tenant: String, $limit: Int, $nextToken: String) {
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

            users(userId: $userId, limit: $limit, nextToken: $nextToken) {
              items {
                userId
                role
                isAdmin
                status
                user {
                  firstName
                  lastName
                  email
                }
              }
            }
          }
        }
      }
  }
}`;

const UpdateUserRole = `mutation UpdateUserRole($tenant: ID!, $input: UserRoleInput!) {
  updateUserRole(tenant: $tenant, input: $input) {
    userId
    role
    isAdmin
    user {
      id
      firstName
    }
  
  }
}`