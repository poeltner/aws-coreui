import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Input, Button } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import logo from '../../assets/img/brand/logo.svg'
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from 'prop-types'
import Log from '../../utils/Logger/Log';
import { withAlert } from '../../utils/Alert/alert';

class AdminSubscriptionView extends Component {constructor(props) {
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
          isLoading: false
        })

        
        selfData.data.me.user.tenants[0].tenant.productsAvailable.map(subscription => {
          console.log("subscription" + subscription.id + " = " + selfData.data.me.user.tenants[0].tenant.subscription)
          if (subscription.id === selfData.data.me.user.tenants[0].tenant.subscription) {
            this.setSelectedSubscription(subscription);
            this.setState({ period: selfData.data.me.user.tenants[0].tenant.subscriptionPeriod });
          }
        })

        selfData.data.me.user.tenants[0].tenant.tenantRoles.map(role => {

          let input= {};
          input['user'+role.name] = role.max;
          this.setState(input);
        })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.BillingAddressModal');
  }

  async onClickUpdate() {
    let additionalUser = []
    this.state.rolesAvailable.map(role => {
      if (this.state['user'+role.name]>0) {
        additionalUser.push({
          role: role.name,
          additionalUser:  this.state['user'+role.name]
        })
      }
    });

    const requestUpdate = {
      subscription: this.state.subscriptionId,
      subscriptionPeriod: this.state.period,
      additionalUser
    }
    const tenant = await API.graphql(graphqlOperation(UpdateTenantSubscription, { tenantId: this.state.tenant, input: requestUpdate}));
    if (tenant.data)
      this.props.alert("Updated")
    else 
      this.props.errorAlert("Error when updating, please try again later")
  }

  handleInputChange(e) {
    let input = [];
    input[e.target.name] = e.target.value;
    console.log("changed " + JSON.stringify(input));
    this.setState(input);
  }

  setSelectedSubscription(subscription) {
    this.setState({
      subscriptionId: subscription.id,
      name: subscription.name,
      description: subscription.description,
      pricingYearly: subscription.pricingYearly,
      pricingMonthly: subscription.pricingMonthly,

      rolesAvailable: subscription.roles
    })
  }

  handleProductChange(e) {
    // let input = [];
    // input[e.target.name] = e.target.value;

    // this.setState(input);
    console.log("Product " + JSON.stringify(e.target.value));
    this.state.input.productsAvailable.map(product => {
      if (product.id === e.target.value) {
        this.setSelectedSubscription(product);

      }
    })
    
  }

  render() {
    const { t } = this.props;
    
    let totalPrice = 0;

    if (this.state.period === 'month') {
      totalPrice = this.state.pricingMonthly;
    } else {
      totalPrice = this.state.pricingYearly;
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg="8">
            <Card>
              <CardHeader>
                <strong>Step 1: Please select the product</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg="4">
                    <img src={logo} alt="logo" style={{width: '80%'}} />
                  </Col>
                  <Col lg="3">
                    <Input type="select" name="product" id="select" onChange={this.handleProductChange} value={this.state.subscriptionId}>
                      {
                        this.state.input.productsAvailable.map(product =>
                        <option key={product.id} value={product.id}>{product.name}</option>
                      )}
                    </Input>
                  </Col>
                  <Col lg="3">
                    <Input type="select" name="period" id="select" onChange={this.handleInputChange} value={this.state.period}>
                      <option value="month">{ t('Monthly')}</option>
                      <option value="year">{ t('Yearly')}</option>
                    </Input>
                  </Col>
                  <Col lg="2">
                    { (this.state.period === 'month') ?
                      <h4>{this.state.pricingMonthly} €</h4>
                      :
                      <h4>{this.state.pricingYearly} €</h4>
                     }
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <hr />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    { this.state.period === "month"  &&
                      <Row >
                        <Col>
                        { t('Save if you buy yearly')}
                        </Col>
                      </Row>
                    }
                    <Row >
                      <Col>
                      { this.state.description}
                      </Col>
                    </Row>
                    
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
                    <Row key={role.name}>
                      <Col lg="4">
                        { role.name }
                      </Col>
                      <Col lg="4">
                        Included: { role.includedUser }
                      </Col>
                      <Col lg="2">
                        <Input name={'user'+role.name} onChange={this.handleInputChange} size="3" value={this.state['user'+role.name] || ''} defaultValue={ role.includedUser }/>
                      </Col>
                      <Col lg="2">
                        { (this.state.period === 'month') ?
                          <h4>{ role.pricingMonthly} € </h4>
                          :
                          <h4>{ role.pricingYearly} € </h4>
                        }
                        
                      </Col>
                    </Row>
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
                    <Col lg="8">
                      <strong>{ this.state.name }</strong><br/>
                      Billing: { this.state.period }
                    </Col>
                    <Col lg="4">
                      { (this.state.period === 'month') ?
                        <h4>{this.state.pricingMonthly} €</h4>
                        :
                        <h4>{this.state.pricingYearly} €</h4>
                      }
                    </Col>
                  </Row>
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
                  { 
                    this.state.rolesAvailable.map(role => {
                      let additionalUser = role.includedUser;
                      additionalUser = this.state['user'+role.name] - additionalUser;
                      console.log("additional user " + additionalUser)
                      if (additionalUser > 0) {
                        if (this.state.period === 'month') {
                          totalPrice += additionalUser*role.pricingMonthly;
                        } else {
                          totalPrice += additionalUser*role.pricingYearly;
                        }
                        return (
                          <div key={role.name}>
                            <Row>
                              <Col lg="8">
                                <strong>{ role.name } </strong><br/>

                                Additional User: {additionalUser}
                              </Col>
                              <Col lg="4">
                              { (this.state.period === 'month') ?
                                <h4>{ additionalUser*role.pricingMonthly} € </h4>
                                :
                                <h4>{ additionalUser*role.pricingYearly} € </h4>
                              }
                              </Col>
                            </Row>
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
                          </div>
                        )
                      }
                    })
                  }
                  
                  <Row>
                    <Col lg="8">
                      <strong>{ t('Total')} </strong><br/>
                      inkl. Ust
                    </Col>
                    <Col lg="4">
                      <h4><strong>{ totalPrice } €</strong></h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      &nbsp;
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button onClick={this.onClickUpdate} color="primary" style={{width:'100%'}}>Update subscription</Button>
                    </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Card>
              <CardHeader>
                <strong>Sie möchten Ihr Konto kündigen?</strong>
              </CardHeader>
              <CardBody>
                Nach der Kündigung Ihres Kontos können Sie Zendesk Support nicht mehr verwenden und nicht mehr auf Ihre Kontodaten zugreifen. 
                <br/> <Link to="">Ja, Konto kündigen</Link>
              </CardBody>
            </Card>
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

            subscription
            subscriptionPeriod

            tenantRoles {
              max
              name
            }

            productsAvailable {
              id
              name
              description

              pricingMonthly
              pricingYearly

              roles {
                name
                pricingMonthly
                pricingYearly
                includedUser
              }
            }
          }
        }
      }
  }
}`;

const UpdateTenantSubscription = `mutation UpdateTenantSubscription($tenantId: ID!, $input: TenantSubscriptionInput!) {
  updateTenantSubscription(tenantId: $tenantId, input: $input) {
    id
    name
    description
    subscription
    subscriptionPeriod
    billingAddress {
      company
    }
  }
}`