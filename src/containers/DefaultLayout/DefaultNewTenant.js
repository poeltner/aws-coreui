/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, FormFeedback, Col, Input, Label } from 'reactstrap';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { withNamespaces } from 'react-i18next';
import Log from '../../utils/Logger/Log';

class DefaultNewTenant extends React.Component {
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
    this.validateTenantId = this.validateTenantId.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  async onClickAdd() {
    if (this.state.validate.tenantIdState === 'has-success') {
      const input = {
        name: this.state.name,
        description: this.state.description,
      }
      this.setState({isLoading: true});
      const response = await API.graphql(graphqlOperation(CreateTenant, { tenantId: this.state.tenantId, input}));
      Log.info(`Tenant added: ${JSON.stringify(response)}`);
      this.setState({isLoading: false});
      // this.props.reload();
      this.state.tenantId='';
      this.state.name='';
      this.state.description='';
      this.state.tenantIdState='';
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

  async validateTenantId(e) {
    // const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
    // if (emailRex.test(e.target.value)) {
    //   validate.emailState = 'has-success';
    // } else {
    //   validate.emailState = 'has-error';
    // }
    // this.setState({ validate })
    const input = {}
    const value = e.target.value;
    if (e.target.value !== '') {
      try {
        const response = await API.graphql(graphqlOperation(CreateTenant, { tenantId: e.target.value, input, checkId: true}));
        Log.info(`Tenant added: ${JSON.stringify(response)}`);
        if (response.data.createTenant.id === value) {
          validate.tenantIdState = 'has-success';
        }
      } catch(err) {
        validate.tenantIdState = 'has-error';
      }
      
      this.setState({ validate })
    }
  }
  


  render() {

    const { t } = this.props;


    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><strong>{ t('Add a new tenant') }</strong></ModalHeader>
          <ModalBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="tenantId" className="pr-1">{ t('Unique ID')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  key="tenantId"
                  type="text"
                  name="tenantId" 
                  id="tenantId" 
                  value={this.state.tenantId || ''}
                  onChange={ (e) => {
                    this.validateTenantId(e)
                    this.handleInputChange(e)
                  }}
                  valid={ this.state.validate.tenantIdState === 'has-success' }
                  invalid={ this.state.validate.tenantIdState === 'has-error' }
                />
                <FormFeedback>
                  {t('ID already taken')}
                </FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="name" className="pr-1">{ t('Name')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  key="name"
                  type="text"
                  name="name" 
                  id="name" 
                  value={this.state.name || ''}
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="name" className="pr-1">{ t('Description')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  key="description"
                  type="text"
                  name="description" 
                  id="description" 
                  value={this.state.description || ''}
                  onChange={this.handleInputChange}
                />
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

export default withNamespaces('layout') (DefaultNewTenant);

const CreateTenant = `mutation CreateTenant($tenantId: ID!, $input: TenantInput!, $checkId: Boolean) {
  createTenant(tenantId: $tenantId, input: $input, checkId: $checkId) {
    id
    name
    description
    
  }
}`