import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Input, Button} from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types'
import AdminsList from './components/AdminsList';
import { Type } from 'react-bootstrap-table2-editor';
import UserInviteModal from './modals/user.invite.modal';
import UserEditModal from './modals/users.edit.modal';

class AdminAdminsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
        tenant: this.props.match.params.tenant
    }
    this.userInviteModal = React.createRef();
    
  }

  isAdminFormater(cell, row) {
    if (cell) {
      return (
        <span>(X) <i className="cui-pencil" style={{fontSize: '8px'}}/></span>
      );
    } else {
      return (
        <span>( ) <i className="cui-pencil" style={{fontSize: '8px'}}/></span>
      );
    }
  }

  tableConfig = {
    qlmethod:'me.user.tenants[0].tenant.admins',
    filterElement: 'title',
    redirectUrl: '/'+this.props.match.params.tenant+'/assets/',
    columns: [
        {
            dataField: 'user.email',
            text: this.props.t('Email'),
            headerClasses: 'text-primary',
            headerStyle: () => {
                return { width: '25%', textAlign: 'left' };
            },
            editable: false
        },
        {
            dataField: 'user.firstName',
            text: this.props.t('First Name'),
            headerClasses: 'text-primary',
            headerStyle: () => {
                return { width: '25%', textAlign: 'left' };
            },
            editable: false
        },
        {
            dataField: 'role',
            text: this.props.t('Role'),
            headerClasses: 'text-primary',
            headerStyle: () => {
                return { width: '25%', textAlign: 'left' };
            },
            editor: {
              type: Type.SELECT,
              options: [{
                value: 'BASIC',
                label: 'Basic'
              }, {
                value: 'ADVANCED',
                label: 'Advanced'
              }, {
                value: 'GOLD',
                label: 'Gold'
              }]
            }
        },
        {
          dataField: 'isAdmin',
          text: this.props.t('Is Admin'),
          headerClasses: 'text-primary',
          headerStyle: () => {
              return { width: '25%', textAlign: 'left' };
          },
          editor: {
            type: Type.CHECKBOX,
            value: 'true:false'
          },
          formatter: this.isAdminFormater
        },
        {
            dataField: 'status',
            text: this.props.t('Status'),
            headerClasses: 'text-primary',
            headerStyle: () => {
                return { width: '25%', textAlign: 'right' };
            }
        }
      

    ]
  }

  render() {
    const { t } = this.props;
    

    return (
      <div className="animated fadeIn">
        <UserInviteModal tenant={this.state.tenant} onRef={ref => (this.userInviteModal = ref)} />
        <Card>
          <CardHeader>
            <i className="fa fa-font-awesome"></i> <b>Admins:</b> { this.state.tenant }
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                Tenant
              </Col>
            </Row>
            <Row>
              <Col>
                { t('Welcome') }
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Row>
              <Col><strong>Admins</strong></Col>
              <Col><Button onClick={this.userInviteModal.toggle} className="float-right" size="sm" color="primary">+</Button></Col>
            </Row>
          </CardHeader>
          <CardBody>
            <AdminsList 
              tenant={this.props.match.params.tenant} 
              tableConfig={this.tableConfig} 
              query={MeData} 
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

AdminAdminsView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      tenant: PropTypes.string,
    }),
  }),
  t: PropTypes.any
}

export default withNamespaces('view_admin') (AdminAdminsView);

const MeData = `query Me($tenant: String, $limit: Int, $nextToken: String) {
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

            tenantRoles {
              name
              inUse
              max
            }

            users(limit: $limit, nextToken: $nextToken) {
              items {
                userId
                role
                isAdmin
                status
                user {
                  firstName
                  lastName
                  email
                }
              }
            }
          }
        }
      }
  }
}`;