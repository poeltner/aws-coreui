/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col, Input, Label } from 'reactstrap';
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import { withNamespaces } from 'react-i18next';
import Log from '../../utils/Logger/Log';

class DefaultTenantSwitcher extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      modal: false,
      isLoading: true,
      tenant: '',
      tenants: []
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

  async updateTenantList () {
    const selfData = await API.graphql(graphqlOperation(MeData));
    // console.log(selfData);
    if (selfData.data.me.user.tenants !== null) {
        this.setState({
            tenants: selfData.data.me.user.tenants,
            isLoading: false
          })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'DefaultRegistration.DefaultRegistration');
  }

  toggle() {
    // console.log("toggle click")
    if (!this.state.modal) {
      this.updateTenantList();
    }
    this.setState({
      modal: !this.state.modal
    })
  }

  handleInputChange(e) {
    this.setState({tenant: e.target.value});
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

    const MakeSelectOptions = function(option) {
        if (option.tenant == null ) return;
        return <option value={option.tenant.id} key={option.tenant.id}>{option.tenant.name}</option>;
    };

    const { t } = this.props;


    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}><strong>{ t('Switch tenant') }</strong></ModalHeader>
          { this.state.isLoading ?
            <div className="animated fadeIn pt-3 text-center">Loading...</div>
            :
          <ModalBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('common:Tenant')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="select" name="select" id="select" onChange={this.handleInputChange}>
                  <option value="">{ t('common:PleaseSelect')}</option>
                  { this.state.tenants.map(MakeSelectOptions) }
                </Input>
              </Col>
            </FormGroup>
          </ModalBody>
          }
          <ModalFooter>
            <Button color="primary" onClick={() => changeTenant()}>{ t('common:Switch') }</Button>
            <Button color="secondary" onClick={this.toggle}>{ t('common:Cancel') }</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('layout') (DefaultTenantSwitcher);

const MeData = `query Me {
  me {
      userId
      user {
        id
        firstName
        lastName
        email

        tenants {
          tenantId
          tenant {
            id
            name
          }
        }
      }
  }
}`;