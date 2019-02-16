import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Input, Button, FormGroup, Label } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import logo from '../../assets/img/brand/logo.svg'
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from 'prop-types'
import Log from '../../utils/Logger/Log';
import { withAlert } from '../../utils/Alert/alert';
import ConfirmSubscriptionModal from './modals/confirmSubscriptionModal';

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

    this.confirmSubscriptionModal = React.createRef();
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
          selfData.data.me.user.tenants[0].tenant.productsAvailable.map(subscription => {
            // console.log("subscription" + subscription.id + " = " + selfData.data.me.user.tenants[0].tenant.subscription)
            if (subscription.id === selfData.data.me.user.tenants[0].tenant.subscription.id) {
              this.setSelectedSubscription(subscription);
              this.setState({ 
                period: selfData.data.me.user.tenants[0].tenant.subscription.period,
                currentPeriod: selfData.data.me.user.tenants[0].tenant.subscription.currentPeriod });
            }
          })
        }

        selfData.data.me.user.tenants[0].tenant.tenantRoles.map(role => {

          let input= {};
          input['user'+role.name] = role.max;
          this.setState(input);
        })
    }
    this.setState({isLoading: false});
    Log.debug('Self loaded ' + JSON.stringify(this.state), 'Admin.SubscriptionView');
  }

  async onClickUpdate() {
    this.setState({isLoadingUpdate:true});
    // collect changes in additional roles
    let additionalUser = []
    this.state.rolesAvailable.map(role => {
      if (this.state['user'+role.name]>0) {
        additionalUser.push({
          role: role.name,
          additionalUser:  this.state['user'+role.name]
        })
      }
    });

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
    // let input = [];
    // input[e.target.name] = e.target.value;

    // this.setState(input);
    // console.log("Product " + JSON.stringify(e.target.value));
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
      totalPrice = this.state.pricingYearly*12;
    }

    return (
      <div className="animated fadeIn">
      { (!this.state.isLoading) ?
      <div>
        <ConfirmSubscriptionModal tenant={this.state.tenant} onRef={ref => (this.confirmSubscriptionModal = ref)} />
        <Row>
          <Col lg="8">
            <Card>
              <CardHeader>
                <strong>Step 1: Please select the product</strong>
              </CardHeader>
              <CardBody>
                <Row className="d-flex align-items-center">
                  <Col lg="4">
                    <FormGroup>
                      <img src={logo} alt="logo" style={{width: '80%'}} />
                    </FormGroup>
                  </Col>
                  <Col lg="3">
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
                  <Col lg="2" className="d-md-down-none">
                    { (this.state.period === 'month') ?
                      <h4>{this.state.pricingMonthly} €</h4>
                      :
                      <h4>{this.state.pricingYearly*12} €</h4>
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
                    <div key={role.name}>
                      <Row>
                        <Col lg="4" xs="6">
                          { role.name }
                        </Col>
                        <Col lg="4"  xs="6">
                          Included: { role.includedUser }
                        </Col>
                        <Col lg="2" xs="6">
                          { (role.upgradeable) ?
                          <FormGroup>
                            <Label htmlFor={'user'+role.name} className="pr-1">{ t('User')}:</Label>
                            <Input id={'user'+role.name}  name={'user'+role.name} onChange={this.handleInputChange} size="3" value={this.state['user'+role.name] || ''}/>
                          </FormGroup>
                          : null }
                        </Col>
                        <Col lg="2" xs="6">
                          { (this.state.period === 'month') ?
                            <h4>{ role.pricingMonthly} € </h4>
                            :
                            <h4>{ role.pricingYearly*12} € </h4>
                          }
                          
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
                  <Row>
                    <Col>
                      Current subscription till:{ t('date', { date: new Date(parseInt(this.state.currentPeriod)) }) }
                      <br /> {this.state.currentPeriod}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      &nbsp;
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      { (this.state.type !== 'TRAIL') ? 
                      <Button onClick={this.onClickUpdate} disabled={this.state.isLoadingUpdate} color="primary" style={{width:'100%'}}>Update subscription{' '} 
                      { (this.state.isLoadingUpdate) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
                      : 
                      <Button disabled  style={{width:'100%'}}>Trail cannot be selected</Button>
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
              Nach der Kündigung Ihres Kontos können Sie Zendesk Support nicht mehr verwenden und nicht mehr auf Ihre Kontodaten zugreifen. 
              <br/> <Link to="">Ja, Konto kündigen</Link>
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
    userInOrder {
      name
      included
      additional
      totalRolePrice
      rolePrice
    }
  }
}`