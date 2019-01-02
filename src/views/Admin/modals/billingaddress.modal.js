/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col, Input, Label } from 'reactstrap';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { withNamespaces } from 'react-i18next';
import Log from '../../../utils/Logger/Log';

class BillingAddressModal extends React.Component {
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
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  async loadData () {
    this.setState({isLoading: true});
    const selfData = await API.graphql(graphqlOperation(MeData, { tenantId: this.state.tenant}));
    console.log(selfData);
    if ((selfData.data.me.user.tenants !== null) 
      && (selfData.data.me.user.tenants[0].tenantId === this.state.tenant)) {
        this.setState({
            input: selfData.data.me.user.tenants[0].tenant.billingAddress,
            isLoading: false
          })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.BillingAddressModal');
  }

  async onClickUpdate() {
    const requestUpdate = {
      billingAddress: this.state.input
    }
    const tenant = await API.graphql(graphqlOperation(UpdateTenant, { tenantId: this.state.tenant, input: requestUpdate}));
    console.log("response " + JSON.stringify(tenant));
  }

  toggle() {
    if (!this.state.modal) {
      this.loadData();
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

    

    const changeTenant = () => {
      const tenant = this.state.tenant;
      if ((tenant !== null) && (tenant !== "")) {
        Log.info('Tenant changed to' + tenant, 'DefaultLayout.DefaultTenantSwitcher');
        localStorage.setItem('tenant', tenant);
        localStorage.setItem('tenantName', tenant);
        this.context.router.history.push("/"+tenant+"/tenants");
        window.location.reload();
      }
    }

    const { t } = this.props;


    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><strong>{ t('Update billing address') }</strong></ModalHeader>
          { this.state.isLoading ?
            <div className="animated fadeIn pt-3 text-center">Loading...</div>
            :
          <ModalBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('Company')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="company" 
                  id="select" 
                  value={this.state.input.company}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
          </ModalBody>
          }
          <ModalFooter>
            <Button color="primary" onClick={() => this.onClickUpdate()}>{ t('common:Change') }</Button>
            <Button color="secondary" onClick={this.toggle}>{ t('common:Cancel') }</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('layout') (BillingAddressModal);

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

const UpdateTenant = `mutation UpdateTenant($tenantId: ID!, $input: TenantInput!) {
  updateTenant(tenantId: $tenantId, input: $input) {
    id
    name
    billingAddress {
      company
    }
  }
}`