import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Input, Button, FormGroup, Label } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import logo from '../../assets/img/brand/logo.svg'
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from 'prop-types'
import Log from '../../utils/Logger/Log';
import { withAlert } from '../../utils/Alert/alert';
import confirm from 'reactstrap-confirm';
import {StripeProvider, Elements} from 'react-stripe-elements';
import PaymentdetailsModal from './modals/paymentdetails.modal';
import ConfirmSubscriptionModal from './modals/confirmSubscriptionModal';

class AdminSubscriptionView extends Component {
  constructor(props) {
    super(props);

    this.state = {
        tenant: this.props.match.params.tenant,
        input: {
          productsAvailable:[],
        },
        period: 'month',
        rolesAvailable: []
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.onClickUpdate = this.onClickUpdate.bind(this);
    this.onClickDeactivate = this.onClickDeactivate.bind(this);
    this.loadData = this.loadData.bind(this);

    this.confirmSubscriptionModal = React.createRef();
    this.paymentDetailsModal = React.createRef();
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData () {
    this.setState({isLoading: true});
    const selfData = await API.graphql(graphqlOperation(MeData, { tenant: this.state.tenant}));
    if ((selfData.data.me.user.tenants !== null) 
      && (selfData.data.me.user.tenants[0].tenantId === this.state.tenant)) {
        this.setState({
          input: selfData.data.me.user.tenants[0].tenant,
          isLoading: false,
        })

        if (selfData.data.me.user.tenants[0].tenant.subscription) {
          for (let i = 0; i < selfData.data.me.user.tenants[0].tenant.productsAvailable.length; i += 1) {
            const subscription = selfData.data.me.user.tenants[0].tenant.productsAvailable[i];
            if (subscription.id === selfData.data.me.user.tenants[0].tenant.subscription.id) {
              this.setSelectedSubscription(subscription);
              this.setState({ 
                paymentMethod: ((selfData.data.me.user.tenants[0].tenant.stripe !== null) && (selfData.data.me.user.tenants[0].tenant.stripe.cards.length > 0)) ? true : false,
                period: selfData.data.me.user.tenants[0].tenant.subscription.period,
                currentPeriod: selfData.data.me.user.tenants[0].tenant.subscription.currentPeriod });
            }
          }
        }

        for (let i = 0; i < selfData.data.me.user.tenants[0].tenant.tenantRoles.length; i += 1) {
          const role = selfData.data.me.user.tenants[0].tenant.tenantRoles[i];
          let input= {};
          input['user'+role.name] = role.max;
          this.setState(input);
        }
    }
    this.setState({isLoading: false});
    Log.debug('Self loaded ' + JSON.stringify(this.state), 'Admin.SubscriptionView');
  }

  async onClickUpdate() {
    this.setState({isLoadingUpdate:true});
    // collect changes in additional roles
    let additionalUser = []
    for (let i = 0; i < this.state.rolesAvailable.length; i += 1) {
      const role = this.state.rolesAvailable[i];
      if (this.state['user'+role.name]>0) {
        additionalUser.push({
          role: role.name,
          additionalUser:  this.state['user'+role.name]
        })
      }
    }

    // prepare request
    const requestUpdate = {
      subscription: this.state.subscriptionId,
      subscriptionPeriod: this.state.period,
      additionalUser
    }
    Log.debug(`Request data ${JSON.stringify(requestUpdate)}`,'Admin.SubscriptionView');
    const response = await API.graphql(graphqlOperation(CheckNewTenantSubscription, { tenant: this.state.tenant, input: requestUpdate}));
    Log.debug(`Graphql reponse: ${JSON.stringify(response)}`);
    if ((response.data !== undefined) && (response.data.checkNewTenantSubscription !== undefined)) {
      this.confirmSubscriptionModal.toggle(response.data.checkNewTenantSubscription);
    } else {
      this.props.errorAlert(this.props.t("Error when updating, please try again later"));
    }
    this.setState({isLoadingUpdate:false});
  }

  async onClickDeactivate() {

    const confirmation = await confirm(); 
    if (confirmation) {
      await API.graphql(graphqlOperation(DeactivateTenant, { tenant: this.state.tenant}));
      window.location.reload();
    }
  }

  handleInputChange(e) {
    let input = [];
    input[e.target.name] = e.target.value;
    // console.log("changed " + JSON.stringify(input));
    this.setState(input);
  }

  setSelectedSubscription(subscription) {
    this.setState({
      subscriptionId: subscription.id,
      name: subscription.name,
      description: subscription.description,
      pricingYearly: subscription.pricingYearly,
      pricingMonthly: subscription.pricingMonthly,
      type: subscription.type,

      rolesAvailable: subscription.roles
    })
  }

  handleProductChange(e) {
    for (let i = 0; i < this.state.input.productsAvailable.length; i += 1) {
      const product = this.state.input.productsAvailable[i];
      if (product.id === e.target.value) {
        this.setSelectedSubscription(product);
      }
    }
  }

  render() {
    const { t } = this.props;
    
    let totalPrice = 0;

    if (this.state.period === 'month') {
      totalPrice = this.state.pricingMonthly;
    } else {
      totalPrice = this.state.pricingYearly*12;
    }

    return (
      <div className="animated fadeIn">
      { (!this.state.isLoading) ?
      <div>
        <ConfirmSubscriptionModal tenant={this.state.tenant} onRef={ref => (this.confirmSubscriptionModal = ref)} />
        <StripeProvider apiKey="pk_test_3zmUxInQc811yRcDnx74HHc6">
        <Elements>
          <PaymentdetailsModal reload={this.loadData} tenant={this.state.tenant} onRef={ref => (this.paymentDetailsModal = ref)} />
        </Elements>
        </StripeProvider>
        <Row>
          <Col lg="8">
            <Card>
              <CardHeader>
                <strong>{t('Step 1: Please select the product')}</strong>
              </CardHeader>
              <CardBody>
                <Row className="d-flex align-items-center">
                  <Col lg="4">
                    <FormGroup>
                      <img src={logo} alt="logo" style={{width: '80%'}} />
                    </FormGroup>
                  </Col>
                  <Col lg="4">
                    <FormGroup>
                      <Input type="select" name="product" id="select" onChange={this.handleProductChange} value={this.state.subscriptionId}>
                        <option>Select</option>
                        {
                          this.state.input.productsAvailable.map(product =>
                          <option key={product.id} value={product.id}>{product.name}</option>
                        )}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col lg="3">
                    <FormGroup>
                      <Input type="select" name="period" id="select" onChange={this.handleInputChange} value={this.state.period}>
                        <option value="month">{ t('Monthly')}</option>
                        <option value="year">{ t('Yearly')}</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <hr />
                  </Col>
                </Row>
                <Row>
                  <Col>
                      { this.state.description}
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <strong>Step 2: Please select number of user</strong>
              </CardHeader>
              <CardBody>
                { 
                
                  this.state.rolesAvailable.map(role => 
                    <div key={role.name}>
                      <Row>
                        <Col lg="4" xs="6" className="d-flex align-items-center">
                          <h4><strong>{ role.name }</strong></h4>
                        </Col>
                        <Col lg="2" xs="6">
                          <Label htmlFor={'price'+role.name} className="pr-1">{ t('Per user')}:</Label>
                            
                          { (this.state.period === 'month') ?
                            <h4>{ role.pricingMonthly} € </h4>
                            :
                            <h4>{ role.pricingYearly*12} € </h4>
                          }
                          
                        </Col>
                        <Col lg="2"  xs="6">
                          <Label htmlFor={'price'+role.name} className="pr-1">{ t('Included')}:</Label>
                          
                          { role.includedUser }
                        </Col>
                        <Col lg="4" xs="6">
                          { (role.upgradeable) ?
                          <FormGroup>
                            <Label htmlFor={'user'+role.name} className="pr-1">{ t('User')}:</Label>
                            <Input id={'user'+role.name}  name={'user'+role.name} onChange={this.handleInputChange} size="3" value={this.state['user'+role.name] || ''}/>
                          </FormGroup>
                          : null }
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <hr/>
                        </Col>
                      </Row>
                    </div>
                  )
                }
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card>
              <CardHeader>
                <strong>{ t('Your subscription') }</strong>
              </CardHeader>
              <CardBody>
                  <Row>
                    <Col lg="8" xs="8">
                      <strong>{ this.state.name }</strong><br/>
                      Billing: { this.state.period }
                    </Col>
                    <Col lg="4" xs="4">
                      { (this.state.period === 'month') ?
                        <h4><strong>{this.state.pricingMonthly} €</strong></h4>
                        :
                        <h4><strong>{this.state.pricingYearly*12} €</strong></h4>
                      }
                      
                    </Col>
                  </Row>
                  { 
                    this.state.rolesAvailable.map(role => {
                      let additionalUser = role.includedUser;
                      additionalUser = this.state['user'+role.name] - additionalUser;
                      // console.log("additional user " + additionalUser)
                      if (additionalUser > 0) {
                        if (this.state.period === 'month') {
                          totalPrice += additionalUser*role.pricingMonthly;
                        } else {
                          totalPrice += additionalUser*role.pricingYearly*12;
                        }
                        return (
                          <div key={role.name}>
                            <Row>
                              <Col>
                                &nbsp;
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="8" xs="8">
                                <strong>{ role.name } </strong><br/>

                                Additional User: {additionalUser}
                              </Col>
                              <Col lg="4" xs="4">
                              { (this.state.period === 'month') ?
                                <h4><strong>{ additionalUser*role.pricingMonthly} € </strong></h4>
                                :
                                <h4><strong>{ additionalUser*role.pricingYearly*12} € </strong></h4>
                              }
                              </Col>
                            </Row>
                          </div>
                        )
                      }
                      return null;
                    })
                  }
                  <Row>
                    <Col>
                      &nbsp;
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <hr/>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="8" xs="8">
                      <strong>{ t('Total')} </strong><br/>
                      inkl. Ust
                    </Col>
                    <Col lg="4" xs="4">
                      <h4><strong>{ totalPrice } €</strong></h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <hr/>
                    </Col>
                  </Row>
                  { this.state.period === "month"  &&
                    <div>
                      <Row >
                        <Col>
                        { t('Save if you buy yearly')}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          &nbsp;
                        </Col>
                      </Row>
                    </div>
                    }
                  <Row>
                    <Col>
                      Current subscription till:{ t('date', { date: new Date(parseInt(this.state.currentPeriod)) }) }
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      &nbsp;
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    { (this.state.paymentMethod) ? 
                      (this.state.type !== 'TRAIL') ? 
                        <Button onClick={this.onClickUpdate} disabled={this.state.isLoadingUpdate} color="primary" style={{width:'100%'}}>Update subscription{' '} 
                        { (this.state.isLoadingUpdate) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
                        : 
                        <Button disabled  style={{width:'100%'}}>Trail cannot be selected</Button>
                      : 
                      <Button onClick={() => this.paymentDetailsModal.toggle()} style={{width:'100%'}} color="warning">Add payment method</Button>
                    }
                    </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Card>
            <CardHeader>
              <strong>Sie möchten Ihr Konto kündigen?</strong>
            </CardHeader>
            <CardBody>
              Nach der Kündigung Ihres Kontos können Sie den Support nicht mehr verwenden und nicht mehr auf Ihre Kontodaten zugreifen. 
              <br/> <Button color="link" onClick={this.onClickDeactivate}>Ja, Konto kündigen</Button>
            </CardBody>
          </Card>
        </Row>
        
      </div>
      : 
      <div>
        loading...
      </div> }
      </div>
    );
  }
}

AdminSubscriptionView.propTypes = {
  alert: PropTypes.any,
  errorAlert: PropTypes.any,
  match: PropTypes.shape({
    params: PropTypes.shape({
      tenant: PropTypes.string
    })
  }),
  params: PropTypes.shape({
    tenant: PropTypes.string
  }),
  t: PropTypes.any,
  tenant: PropTypes.string
}

export default withNamespaces('view_admin') (withAlert(AdminSubscriptionView));

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
            description
            status

            subscription {
              id
              name
              period
              currentPeriod
            }
            

            tenantRoles {
              max
              name
            }

            stripe {
              standard
              cards {
                id
                brand
                last4
              }
            }

            productsAvailable {
              id
              name
              description

              pricingMonthly
              pricingYearly
              type

              roles {
                name
                pricingMonthly
                pricingYearly
                includedUser
                upgradeable
              }
            }
          }
        }
      }
  }
}`;

const CheckNewTenantSubscription = `mutation CheckNewTenantSubscription($tenant: ID!, $input: TenantSubscriptionInput!) {
  checkNewTenantSubscription(tenant: $tenant, input: $input) {
    orderId
    priceFirstMonth
    totalPrice
    orderDate
    subscriptionId
    subscriptionName
    subscriptionPeriod
    subscriptionPrice
    orderStatus
    currentPeriod
    userInOrder {
      name
      included
      additional
      totalRolePrice
      rolePrice
    }
  }
}`

const DeactivateTenant = `mutation DeactivateTenant($tenant: ID!) {
  deactivateTenant(tenant: $tenant) {
    id
    name
  }
}`