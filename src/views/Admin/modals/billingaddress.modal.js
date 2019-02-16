/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Row, Col, Input, Label } from 'reactstrap';
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
    const selfData = await API.graphql(graphqlOperation(MeData, { tenant: this.state.tenant}));
    // console.log(selfData);
    if ((selfData.data.me.user.tenants !== null) 
      && (selfData.data.me.user.tenants[0].tenantId === this.state.tenant)) {
        this.setState(selfData.data.me.user.tenants[0].tenant.billingAddress)
        this.setState({
             isLoading: false
          })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.BillingAddressModal');
  }

  async onClickUpdate() {
    this.setState({isloading: true});
    const requestUpdate = {
      billingAddress: {
        type: this.state.type,
        company: this.state.company,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        country: this.state.country,
        state: this.state.state,
        zipCode: this.state.zipCode,
        city: this.state.city,
        street1: this.state.street1,
        street2: this.state.street2,
        email: this.state.email,
        vat: this.state.vat
      }
    }
    await API.graphql(graphqlOperation(UpdateTenant, { tenant: this.state.tenant, input: requestUpdate}));
    // console.log("response " + JSON.stringify(tenant));
    this.setState({isloading: false});
    this.props.reload();
    this.toggle();
  }

  toggle() {
    if (!this.state.modal) {
      this.loadData();
    }
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


  render() {

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
                <Label htmlFor="company" className="pr-1">{ t('Individual or Company')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Row>
                  <Col>
                    <FormGroup check>
                      <Label check>
                        <Input 
                          type="radio" 
                          name="type" 
                          id="type" 
                          value="individual"
                          checked={this.state.type === 'individual'} 
                          onChange={this.handleInputChange} 
                        />{' '}
                        Individual
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Label check>
                        <Input 
                          type="radio" 
                          name="type" 
                          value="company"
                          id="type" 
                          checked={this.state.type === 'company'} 
                          onChange={this.handleInputChange} 
                        />{' '}
                        Company
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </FormGroup>
            { (this.state.type === 'company') ?
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="company" className="pr-1">{ t('Company')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="company" 
                  id="select" 
                  value={this.state.company || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            : 
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="firstName" className="pr-1">{ t('Name')}:</Label>
              </Col>
              <Col xs="12" md="4">
                <Input 
                  type="input" 
                  name="firstName" 
                  id="firstName" 
                  value={this.state.firstName || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
              <Col xs="12" md="5">
                <Input 
                  type="input" 
                  name="lastName" 
                  id="lastName" 
                  value={this.state.lastName || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            }
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('Country')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="country" 
                  id="select" 
                  value={this.state.country || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <Row>
              <Col>
                <hr/>
              </Col>
            </Row>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('Street')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="street1" 
                  id="select" 
                  value={this.state.street1 || ''}
                  onChange={this.handleInputChange} 
                />
                <Input 
                  type="input" 
                  name="street2" 
                  id="select" 
                  value={this.state.street2 || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('Zip code')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="zipCode" 
                  id="select" 
                  value={this.state.zipCode || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('City')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="city" 
                  id="select" 
                  value={this.state.city || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('State')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="state" 
                  id="select" 
                  value={this.state.state || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <Row>
              <Col>
                <hr/>
              </Col>
            </Row>
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
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('VAT ID (optional)')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="vat" 
                  id="select" 
                  value={this.state.vat || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
          </ModalBody>
          }
          <ModalFooter>
            <Button color="primary" onClick={() => this.onClickUpdate()}>{ t('common:Change') }{' '} 
              { (this.state.isloading) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
            <Button color="secondary" onClick={this.toggle}>{ t('common:Cancel') }</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('layout') (BillingAddressModal);

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

            billingAddress {
              type
              company
              firstName
              lastName
              street1
              street2
              zipCode
              city
              state
              country
              email
              vat

            }
          }
        }
      }
  }
}`;

const UpdateTenant = `mutation UpdateTenant($tenant: ID!, $input: TenantInput!) {
  updateTenant(tenant: $tenant, input: $input) {
    id
    name
    billingAddress {
      company
    }
  }
}`