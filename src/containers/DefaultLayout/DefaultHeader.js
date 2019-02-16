import React, { Component } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'
import { withNamespaces } from 'react-i18next';
import DefaultLanguageSwitcher from './DefaultLanguageSwitcher';
import Log from '../../utils/Logger/Log';
import DefaultTenantSwitcher from './DefaultTenantSwitcher';
import DefaultNewTenant from './DefaultNewTenant';


const defaultProps = {};

class DefaultHeader extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      showLanguageSwitcher: false,
      showTenantSwitcher: false
    }

    this.tenantSwitcher = React.createRef();
    this.newTenant = React.createRef();

    this.toggleLanguageSwitcher = this.toggleLanguageSwitcher.bind(this);
    this.toggleTenantSwitcher = this.toggleTenantSwitcher.bind(this);
  }

  componentDidMount() {
      const tenant = localStorage.getItem('tenant');
  
      if (tenant) {
          Log.info('Tenant changed to '+ JSON.stringify(tenant), 'DefaultLayout.DefaultHeader')
          this.setState({tenantName: tenant});
      }
    }

  toggleLanguageSwitcher() {
    this.setState({
      showLanguageSwitcher: !this.state.showLanguageSwitcher
    })
  }

  toggleTenantSwitcher() {
    this.tenantSwitcher.toggle();
  }

  toggleNewTenant() {
    this.newTenant.toggle();
  }

  onClickSettings(e) {
    e.preventDefault()
    this.context.router.history.push("/profile/edit");
  }

  render() {

    // eslint-disable-next-line
    const { t, children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <DefaultLanguageSwitcher showModal={this.state.showLanguageSwitcher} toggle={this.toggleLanguageSwitcher}/>
        <DefaultTenantSwitcher onRef={ref => (this.tenantSwitcher = ref)} />
        <DefaultNewTenant onRef={ref => (this.newTenant = ref)} />
      
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <b>{ t('common:Tenant') }:</b> { this.state.tenantName }
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            div
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={'assets/img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>{ t('Tenants') }</strong></DropdownItem>
              <DropdownItem onClick={() => this.toggleNewTenant()}><i className="fa fa-plus"></i> { t('Create tenant') }</DropdownItem>
              <DropdownItem onClick={() => this.toggleTenantSwitcher()}><i className="fa fa-exchange"></i> { t('Switch tenant') }</DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>{ t('Profile') }</strong></DropdownItem>
              <DropdownItem onClick={e => this.onClickSettings(e)}><i className="fa fa-wrench"></i> { t('common:Settings') }</DropdownItem>
              <DropdownItem onClick={() => this.setState({ showLanguageSwitcher: true })}><i className="fa fa-language"></i> { t('Change language') }</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> { t('common:Logout') }</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        <AppAsideToggler className="d-lg-none" mobile />
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = {
  children: PropTypes.node,
  onLogout: PropTypes.func
};

DefaultHeader.defaultProps = defaultProps;

export default withNamespaces('layout')(DefaultHeader);
