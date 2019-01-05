/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col, Input, Label } from 'reactstrap';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { withNamespaces } from 'react-i18next';
import Log from '../../../utils/Logger/Log';

class UserInviteModal extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      tenant: this.props.tenant,
      modal: false,
      isLoading: true,
      input: {}
    };    

    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClickInvite = this.onClickInvite.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  async onClickInvite() {
    const user = await API.graphql(graphqlOperation(InviteUser, { tenant: this.state.tenant, email: this.state.input.email}));
    console.log("response " + JSON.stringify(user));
  }

  toggle() {
    if (!this.state.modal) {
    //   this.loadData();
    }
    this.setState({
      modal: !this.state.modal
    })
  }

  handleInputChange(e) {
    const input = {};
    input[e.target.name] = e.target.value;
    this.setState({input});
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
                  value={this.state.input.email || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.onClickInvite()}>{ t('common:Invite') }</Button>
            <Button color="secondary" onClick={this.toggle}>{ t('common:Cancel') }</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('layout') (UserInviteModal);

const MeData = `query Me($tenantId: String) {
  me {
      userId
      user {
        id
        firstName
        lastName
        email

        tenants(tenantId: $tenantId) {
          tenantId
          tenant {
            id
            name

            billingAddress {
              company
            }
          }
        }
      }
  }
}`;

const InviteUser = `mutation inviteUser($tenant: ID!, $email: String!) {
    inviteUser(tenant: $tenant, email: $email) {
    id
    email
    status
  }
}`