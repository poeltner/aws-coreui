/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Col, Input, Label } from 'reactstrap';
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
      tenant: ''
    };    

    this.handleInputChange = this.handleInputChange.bind(this);
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

    const { t } = this.props;

    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><strong>{ t('Switch tenant') }</strong></ModalHeader>
          <ModalBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="select" className="pr-1">{ t('common:Tenant')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="select" name="select" id="select" onChange={this.handleInputChange}>
                  <option value="">{ t('common:PleaseSelect')}</option>
                  <option value="musterFirma">Muster Firma</option>
                  <option value="testFirma">Test Firma</option>
                  <option value="coolFirma">Cool Firma</option>
                </Input>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => changeTenant('musterFirma')}>{ t('common:Switch') }</Button>
            <Button color="secondary" onClick={this.props.toggle}>{ t('common:Cancel') }</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withNamespaces('layout') (DefaultTenantSwitcher);
