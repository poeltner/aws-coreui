import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Nav, NavItem, NavLink,
  TabContent, TabPane } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ProfilePane from './panes/profile.pane';
import SecurityPane from './panes/security.pane';
import SettingsPane from './panes/settings.pane';

class ProfileEditView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      activeTab: '1'
    }
    // this.handleInputChange = this.handleInputChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  // async componentDidMount() {
  //   // const selfData = await API.graphql(graphqlOperation(MeData));
  //   // this.setState({ 
  //   //   id: selfData.data.me.userId,
  //   //   firstName: selfData.data.me.user.firstName,
  //   //   lastName: selfData.data.me.user.lastName,
  //   //   email: selfData.data.me.user.email,
  //   // });
  //   // Log.info('Self loaded ' + JSON.stringify(this.state), 'Profile.EditView');
  // }

  // async onSubmit() {
  //   const meData = await API.graphql(graphqlOperation(
  //     UpdateMe,
  //     {
  //       id: this.state.id,
  //       input: {
  //         firstName: this.state.firstName,
  //         lastName: this.state.lastName,
  //         email: this.state.email,
  //       } ,
  //     },
  //   ));
  //   Log.info("Submit response: " + JSON.stringify(meData), "Profile.EditView");
  // }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  
  // handleInputChange(e) {
  //   let input = [];
  //   input[e.target.name] = e.target.value;
  //   this.setState(input);
  //   Log.info('Input changed ' + JSON.stringify(this.state), 'Profile.EditView');
  // }
    
  render() {
    const { t } = this.props;
    

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  <i className="fa fa-font-awesome"></i> <b>{t('Profile')}</b> 
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                 <i className="fa fa-font-awesome"></i> <b>Security</b> 
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.toggle('3'); }}
                >
                 <i className="fa fa-font-awesome"></i> <b>Settings</b> 
                </NavLink>
              </NavItem>
            </Nav>

          </CardHeader>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
                <ProfilePane />
            </TabPane>
            <TabPane tabId="2">
              <CardBody>
                <SecurityPane />
              </CardBody>
            </TabPane>
            <TabPane tabId="3">
              <CardBody>
                <SettingsPane />
              </CardBody>
            </TabPane>
          </TabContent>
        </Card>
      </div>
    );
  }
}

ProfileEditView.propTypes = {
  t: PropTypes.any
}

export default withNamespaces('view_profile') (ProfileEditView);

// const UpdateMe = `mutation UpdateUser($id: ID!, $input: UserInput!) {
//   updateUser(id: $id, input: $input) {
//     id
//     firstName
//     lastName
//     email

//     tenants {
//       tenantId

//       tenant {
//         id
//         name
//       }
//     }
//   }
// }`;

// const MeData = `query Me {
//   me {
//       userId
//       user {
//         id
//         firstName
//         lastName
//         email
//       }
//   }
// }`;
