import React, { Component } from 'react';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'
import { withTranslation } from 'react-i18next';
import DefaultLanguageSwitcher from './DefaultLanguageSwitcher';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLanguageSwitcher: false
    }

    this.toggleLanguageSwitcher = this.toggleLanguageSwitcher.bind(this);
  }

  onClickLogout() {
    Auth.signOut()
    .then(window.location.reload())
    .catch(err => console.log(err));
  }

  toggleLanguageSwitcher() {
    this.setState({
      showLanguageSwitcher: !this.state.showLanguageSwitcher
    })
  }

  render() {

    // eslint-disable-next-line
    const { t, children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <DefaultLanguageSwitcher showModal={this.state.showLanguageSwitcher} toggle={this.toggleLanguageSwitcher}/>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#/users">Users</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">Settings</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={'assets/img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>{ t('Tenants') }</strong></DropdownItem>
              <DropdownItem><i className="fa fa-plus"></i> { t('Create tenant') }</DropdownItem>
              <DropdownItem><i className="fa fa-exchange"></i> { t('Switch tenant') }</DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>{ t('Profile') }</strong></DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> { t('common:Settings') }</DropdownItem>
              <DropdownItem onClick={() => this.setState({ showLanguageSwitcher: true })}><i className="fa fa-language"></i> { t('Change language') }</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => this.onClickLogout()}><i className="fa fa-lock"></i> { t('common:Logout') }</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        <AppAsideToggler className="d-lg-none" mobile />
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withTranslation('layout')(DefaultHeader);
