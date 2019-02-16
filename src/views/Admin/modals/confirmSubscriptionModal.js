/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { withNamespaces } from 'react-i18next';
import Log from '../../../utils/Logger/Log';

class ConfirmSubscriptionModal extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      tenant: this.props.tenant,
      modal: false,
      isLoading: true,
      input: {},
      order: {
        userInOrder: []
      }
    };    

    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClickConfirm = this.onClickConfirm.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  async onClickConfirm() {
    this.setState({isLoadingUpdate:true});
    const response = await API.graphql(graphqlOperation(ConfirmTenantSubscription, { tenant: this.state.tenant, orderId: this.state.orderId}));
    Log.info(`Email added: ${JSON.stringify(response)}`);
    this.setState({isLoadingUpdate:false});
    this.toggle();
  }

  toggle(order) {
    this.setState({
      modal: !this.state.modal,
      isLoadingUpdate:false,
    })
    if ((order !== 'undefined') || (order !== null)) {
        // Log.info(`Order: ${JSON.stringify(order)}`, 'Admin.ConfirmSubscriptionModal');
        this.setState({ order, orderId: order.orderId });
    }
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
          <ModalHeader toggle={this.toggle}><strong>{ t('Confirm order upgrade') }</strong></ModalHeader>
          <ModalBody>
            <Row>
                <Col lg="8" xs={8}>
                    <strong>{ this.state.order.subscriptionName }</strong><br/>
                    Billing: { this.state.order.subscriptionPeriod }
                </Col>
                <Col lg="4" xs={4}>
                    <strong>{ this.state.order.subscriptionPrice } €</strong><br/> {t('per ') }{ this.state.order.subscriptionPeriod }
                </Col>
            </Row>
            { (this.state.order.userInOrder !== undefined) ?
                this.state.order.userInOrder.map(role => {
                    
                    return (
                        <div key={role.name}>
                        <Row>
                            <Col lg="8" xs={8}>
                            <strong>{ role.name } </strong><br/>

                            User (included): { role.additional+role.included } ({role.included})
                            </Col>
                            <Col lg="4" xs={4}>
                               <strong>{ role.totalRolePrice } €</strong><br/> {t('per ') }{ this.state.order.subscriptionPeriod }
                            </Col>
                        </Row>
                        </div>
                    )
                    
            }) : null }
            <Row>
                <Col>
                <hr/>
                </Col>
            </Row>
            <Row>
                <Col lg="8" xs={8}>
                    <strong>{ t('Total')} </strong><br/>
                    inkl. Ust
                </Col>
                <Col lg="4" xs={4}>
                    <strong>{ this.state.order.totalPrice } €</strong><br/> {t('per ') }{ this.state.order.subscriptionPeriod }
                </Col>
            </Row>
            {(this.state.order.priceFirstMonth >= 0 ) ?
                <div>
                    <Row>
                        <Col>
                        <hr/>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="8" xs={8}>
                        { t('The price for the first subscprtion upgrade period till ') } { t('date', { date: new Date(parseInt(this.state.order.currentPeriod)) }) }
                        </Col>
                        <Col lg="4" xs={2}>
                            <h4><strong>{ this.state.order.priceFirstMonth } €</strong></h4>
                        </Col>
                    </Row>
                </div>
                : null
            }
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.onClickConfirm} disabled={this.state.isLoadingUpdate} color="primary" style={{width:'100%'}}>Update subscription{' '} 
                      { (this.state.isLoadingUpdate) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
            <Button color="secondary" onClick={this.toggle}>{ t('common:Cancel') }</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('view_admin') (ConfirmSubscriptionModal);

const ConfirmTenantSubscription = `mutation confirmTenantSubscription($tenant: ID!, $orderId: String!) {
    confirmTenantSubscription(tenant: $tenant, orderId: $orderId) {
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