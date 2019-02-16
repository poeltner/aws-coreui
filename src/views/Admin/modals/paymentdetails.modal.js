/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col, Input, Label } from 'reactstrap';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { withNamespaces } from 'react-i18next';
import Log from '../../../utils/Logger/Log';
import {CardExpiryElement, CardCVCElement, PostalCodeElement, CardNumberElement, injectStripe} from 'react-stripe-elements';

class PaymentDetailsModal extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      tenant: this.props.tenant,
      modal: false,
      isLoading: false,
      isAdding: false,
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

  async onClickUpdate() {
   
    this.setState({isAdding: true});
    const { token, error } = await this.props.stripe.createToken({name: this.state.name});
    if (error) {
      this.setState({isAdding: false});
      throw Error("Error " + JSON.stringify(error));
    }
    const requestUpdate = {
      token: token.id
    }

    try {
      await API.graphql(graphqlOperation(UpdateTenantPayment, { tenant: this.state.tenant, input: requestUpdate}));
      this.props.reload();
      this.toggle();
    } catch(err) {
      this.setState({isAdding: false});
      Log.error(err, 'PaymentDetails');
    }
    this.setState({
      isAdding: false,
      name: ''
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  handleInputChange(e) {
    const input = {};
    input[e.target.name] = e.target.value;
    this.setState(input);
  }


  render() {

    const { t } = this.props;


    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><strong>{ t('Payment Details') }</strong></ModalHeader>
          <ModalBody>
            {/* <CardElement /> */}
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="name" className="pr-1">{ t('Name')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="name" 
                  id="name" 
                  value={this.state.name || ''}
                  onChange={ (e) => {
                    this.handleInputChange(e)
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="name" className="pr-1">{ t('Number')}:</Label>
              </Col>
              <Col>
                <CardNumberElement className="form-control" />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="name" className="pr-1">{ t('Expiration Date')}:</Label>
              </Col>
              <Col>
                <CardExpiryElement className="form-control" />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="name" className="pr-1">{ t('CVC')}:</Label>
              </Col>
              <Col>
                <CardCVCElement className="form-control" />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="name" className="pr-1">{ t('Postal Code')}:</Label>
              </Col>
              <Col>
                <PostalCodeElement className="form-control" />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={this.state.isAdding} onClick={() => this.onClickUpdate()}>{ t('common:Add') }{' '} 
              { (this.state.isAdding) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
            <Button color="secondary" onClick={this.toggle}>{ t('common:Cancel') }</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('layout') (injectStripe(PaymentDetailsModal));


const UpdateTenantPayment = `mutation UpdateTenantPayment($tenant: ID!, $input: BillingPaymentInput!) {
  updateTenantPayment(tenant: $tenant, input: $input) {
    id
    name
  }
}`