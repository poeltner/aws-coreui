import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
// import { Link } from 'react-router-dom';
// import GraphQlBootstrapTable from '../../components/GraphQlBootstrapTable/GraphQlBootstrapTable';
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../utils/Logger/Log';
import PropTypes from 'prop-types'
import BillingAddressModal from './modals/billingaddress.modal';
import {StripeProvider, Elements} from 'react-stripe-elements';
import PaymentdetailsModal from './modals/paymentdetails.modal';
import BillingEmailModal from './modals/billingemail.modal';
import OrdersList from './components/OrdersList';

class AdminBillingView extends Component {constructor(props) {
    super(props);

    this.state = {
        tenant: this.props.match.params.tenant,
        input: {
          stripe: {
            cards: []
          },
          billingEmail: [],
          billingAddress: {},
        },
    }
    this.loadData = this.loadData.bind(this);

    this.billingAddressModal = React.createRef();
    this.billingEmailModal = React.createRef();
    this.paymentDetailsModal = React.createRef();
  }

  async loadData () {
    this.setState({isLoading: true});
    const selfData = await API.graphql(graphqlOperation(MeData, { tenant: this.state.tenant}));
    if ((selfData.data.me.user.tenants !== null) 
      && (selfData.data.me.user.tenants[0].tenantId === this.state.tenant)) {
        this.setState({
            input: selfData.data.me.user.tenants[0].tenant,
            isLoading: false
          })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.BillingAddressModal');
  }

  componentDidMount() {
    this.loadData();
  }

  async onClickRemove(email) {
    const input = {
      email,
    }
    const response = await API.graphql(graphqlOperation(RemoveTenantBillingEmail, { tenant: this.state.tenant, input}));
    Log.info(`Email added: ${JSON.stringify(response)}`);
    this.loadData();
  }

  async onClickRemovePayment(cardId) {
    const response = await API.graphql(graphqlOperation(DeleteTenantPayment, { tenant: this.state.tenant, paymentId: cardId}));
    Log.info(`Payment removed: ${JSON.stringify(response)}`);
    this.loadData();
  }

  async onClickSetStandardPayment(cardId) {
    const response = await API.graphql(graphqlOperation(SetStandardTenantPayment, { tenant: this.state.tenant, paymentId: cardId}));
    Log.info(`Payment removed: ${JSON.stringify(response)}`);
    this.loadData();
  }


  render() {
    const { t } = this.props;
    

    return (
      <StripeProvider apiKey="pk_test_3zmUxInQc811yRcDnx74HHc6">
      <div className="animated fadeIn">
      <BillingAddressModal reload={this.loadData} tenant={this.state.tenant} onRef={ref => (this.billingAddressModal = ref)} />
      <BillingEmailModal reload={this.loadData} tenant={this.state.tenant} onRef={ref => (this.billingEmailModal = ref)} />
      <Elements>
      <PaymentdetailsModal reload={this.loadData} tenant={this.state.tenant} onRef={ref => (this.paymentDetailsModal = ref)} />
      </Elements>
        <Card>
          <CardHeader>
            <i className="fa fa-font-awesome"></i> <b>Billing</b>
          </CardHeader>
          <CardBody>
            <Row>
              <Col sm="4">
                <Row>
                  <Col>
                    <strong>{ t('Payment method') }</strong> (<span className="btn-link" style={{cursor: 'pointer'}} onClick={this.paymentDetailsModal.toggle}>{ t('common:Add') }</span>)<br/>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <hr />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {
                      ((this.state.input.stripe !== undefined) && (this.state.input.stripe !== null)) ?
                      this.state.input.stripe.cards.map(card =>
                      <Row key={card.id}>
                        <Col>
                          {card.brand } ****{card.last4 } {(this.state.input.stripe.standard === card.id) ? <strong>(Standard)</strong> : <span style={{cursor: 'pointer'}} onClick={() => this.onClickSetStandardPayment(card.id)} className="btn-link">(set standard)</span> } <span style={{cursor: 'pointer'}} onClick={() => this.onClickRemovePayment(card.id)} className="btn-link"><i className="fa fa-trash-o" /></span>
                        </Col>
                      </Row>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col>&nbsp;</Col>
                </Row>
              </Col>
              <Col sm="4">
                <Row>
                  <Col>
                    <strong>{ t('Billing address') }</strong> (<span className="btn-link" style={{cursor: 'pointer'}} onClick={this.billingAddressModal.toggle}>{ t('common:Change') }</span>)<br/>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <hr />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    { ((this.state.input.billingAddress !== undefined) && (this.state.input.billingAddress !== null)) ?
                    <div>
                    { (this.state.input.billingAddress.type === 'company') ? <div> {this.state.input.billingAddress.company} <br/></div> : 
                    <div>{ this.state.input.billingAddress.firstName } { this.state.input.billingAddress.lastName }<br/></div>}
                    { this.state.input.billingAddress.street1 }<br/>
                    { (this.state.input.billingAddress.street2) ? <div> {this.state.input.billingAddress.street2} <br/></div> : null }
                    { this.state.input.billingAddress.zipCode } { this.state.input.billingAddress.city }<br/>
                    { this.state.input.billingAddress.state } { this.state.input.billingAddress.country }
                    </div> 
                    : null }
                  </Col>
                </Row>
                <Row>
                  <Col>&nbsp;</Col>
                </Row>
              </Col>
              <Col sm="4">
                <Row>
                  <Col>
                  <strong>{ t('Billing to') }</strong> (<span className="btn-link" style={{cursor: 'pointer'}} onClick={this.billingEmailModal.toggle}>{ t('common:Add Email') }</span>)<br/>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <hr />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    { 
                      ((this.state.input.billingEmail !== undefined) && (this.state.input.billingEmail !== null)) ?
                      this.state.input.billingEmail.map(email =>
                        <Row key={email}>
                          <Col>
                          { email } <span onClick={() => this.onClickRemove(email)} style={{cursor: 'pointer'}} className="btn-link"><i className="fa fa-trash-o" /></span>
                          </Col>
                        </Row>
                      )
                      : null
                    }
                  </Col>
                </Row>
                <Row>
                  <Col>&nbsp;</Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <strong>Rechnungen</strong>
          </CardHeader>
          <CardBody>
            <OrdersList 
              tenant={this.props.match.params.tenant}
            />
          </CardBody>
        </Card>
      </div>
      </StripeProvider>
    );
  }
}

AdminBillingView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      tenant: PropTypes.string,
    }),
  }),
  t: PropTypes.any
}

export default withNamespaces('view_admin') (AdminBillingView);


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

            stripe {
              standard
              cards {
                id
                brand
                last4
              }
            }
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

            billingEmail

            invoices {
              items {
                invoiceId
                totalPrice
              }
            }

            orders {
              orderId
              orderDate
              orderStatus
              totalPrice
              invoiceId
              priceFirstMonth
            }
          }
        }
      }
  }
}`;


const RemoveTenantBillingEmail = `mutation removeTenantBillingEmail($tenant: ID!, $input: BillingEmailInput!) {
  removeTenantBillingEmail(tenant: $tenant, input: $input) {
    id
    billingEmail
    
  }
}`

const DeleteTenantPayment = `mutation DeleteTenantPayment($tenant: ID!, $paymentId: ID!) {
  deleteTenantPayment(tenant: $tenant, paymentId: $paymentId) {
    id
    
  }
}`

const SetStandardTenantPayment = `mutation SetStandardTenantPayment($tenant: ID!, $paymentId: ID!) {
  setStandardTenantPayment(tenant: $tenant, paymentId: $paymentId) {
    id
    
  }
}`