/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col, Input, Label, FormFeedback } from 'reactstrap';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { withNamespaces } from 'react-i18next';
import Log from '../../../utils/Logger/Log';

class BillingEmailModal extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      tenant: this.props.tenant,
      modal: false,
      isLoading: false,
      input: {},
      validate: {}
    };    

    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClickAdd = this.onClickAdd.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  async onClickAdd() {

    if (this.state.validate.emailState === 'has-success') {
      const input = {
        email: this.state.email,
      }
      this.setState({isLoading: true});
      const response = await API.graphql(graphqlOperation(AddTenantBillingEmail, { tenant: this.state.tenant, input}));
      Log.info(`Email added: ${JSON.stringify(response)}`);
      this.setState({isLoading: false});
      this.props.reload();
      this.state.email='';
      this.state.validate.emailState='';
      this.toggle();
    }
  }

  toggle() {
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

  validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
    if (emailRex.test(e.target.value)) {
      validate.emailState = 'has-success';
    } else {
      validate.emailState = 'has-error';
    }
    this.setState({ validate })
  }
  


  render() {

    const { t } = this.props;


    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><strong>{ t('Add billing email') }</strong></ModalHeader>
          <ModalBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('Email')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  key="email"
                  type="email"
                  name="email" 
                  id="email" 
                  value={this.state.email || ''}
                  onChange={ (e) => {
                    this.validateEmail(e)
                    this.handleInputChange(e)
                  }}
                  placeholder="myemail@email.com"
                  valid={ this.state.validate.emailState === 'has-success' }
                  invalid={ this.state.validate.emailState === 'has-error' }
                />
                <FormFeedback>
                  Uh oh! Looks like there is an issue with your email. Please input a correct email.
                </FormFeedback>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.onClickAdd()}>{ t('common:Add') } {' '} 
              { (this.state.isLoading) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }
            </Button>
            <Button color="secondary" onClick={this.toggle}>{ t('common:Cancel') }</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('layout') (BillingEmailModal);

const AddTenantBillingEmail = `mutation addTenantBillingEmail($tenant: ID!, $input: BillingEmailInput!) {
  addTenantBillingEmail(tenant: $tenant, input: $input) {
    id
    billingEmail
    
  }
}`