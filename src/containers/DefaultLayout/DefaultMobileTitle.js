import React, { Component } from 'react';
import { Nav, NavItem } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import Log from '../../utils/Logger/Log';


class DefaultMobileTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tenantName: ''
        }
    }

    componentDidMount() {
        const tenant = localStorage.getItem('tenant');

        if (tenant) {
            Log.info('Tenant changed to '+ JSON.stringify(tenant), 'DefaultLayout.DefaultMobileTitle')
            this.setState({tenantName: tenant});
        }
    }

    render() {

        const { t } = this.props;

        return (
          <Nav className="mobileTitle">
              <NavItem>
                  <b>{ t('common:Tenant') }: </b> { this.state.tenantName }
              </NavItem>
          </Nav>
        );
      }

}

export default withNamespaces('layout')(DefaultMobileTitle);