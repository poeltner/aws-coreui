import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import GraphQlBootstrapTable from '../../components/GraphQlBootstrapTable/GraphQlBootstrapTable';
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../utils/Logger/Log';
import PropTypes from 'prop-types'
class AdminBillingView extends Component {constructor(props) {
    super(props);

    this.state = {
        tenant: this.props.match.params.tenant,
    }
    this.loadMe = this.loadMe.bind(this);
  }

  async loadMe () {
    
    const selfData = await API.graphql(graphqlOperation(MeData, { tenantId: 'd854ae79-aa18-4e06-a493-d8067d047a22'}));
    
    if (selfData.data.me.user.tenants !== null) {
        this.setState({
            tenants: selfData.data.me.user.tenants,
            isLoading: false
          })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.BillingView');
  }

  tableConfig = {
    qlmethod:'listTenantAssets',
    filterElement: 'title',
    redirectUrl: '/'+this.props.match.params.tenant+'/assets/',
    columns: [
        {
            dataField: 'date',
            text: this.props.t('Date'),
            headerClasses: 'text-primary',
            headerStyle: () => {
                return { width: '25%', textAlign: 'left' };
            }
        },
        {
            dataField: 'invoiceNr',
            text: this.props.t('Invoice #'),
            headerClasses: 'text-primary',
            headerStyle: () => {
                return { width: '25%', textAlign: 'left' };
            }
        },
        {
            dataField: 'amount',
            text: this.props.t('Amount'),
            headerClasses: 'text-primary',
            headerStyle: () => {
                return { width: '25%', textAlign: 'center' };
            }
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
        <Card>
          <CardHeader>
            <i className="fa fa-font-awesome"></i> <b>Billing:</b> { this.state.tenant } <Button onClick={this.loadMe}>LoadMe</Button>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <strong>{ t('Payment method') }:</strong> <Link to="">{ t('common:Change') }</Link><br/>
              </Col>
              <Col>
                <strong>{ t('Billing address') }</strong> <Link to="">{ t('common:Change') }</Link><br/>
              </Col>
              <Col>
                <strong>{ t('Billing to') }</strong> <Link to="">{ t('common:Add') }</Link><br/>
              </Col>
            </Row>
            <Row>
              <Col>
              
              </Col>
              <Col>
                CONDA Unternehmensberatungs GmbH<br/>
                Paul Poeltner<br/>
                Donau-City-Straße 6<br/>
                Wien, Wien 1220<br/>
                Austria
              </Col>
              <Col>
                Billing to
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
            <strong>Rechnungen</strong>
          </CardHeader>
          <CardBody>
            <GraphQlBootstrapTable tenant={this.props.match.params.tenant} tableConfig={this.tableConfig} query={ListAssets} />
          </CardBody>
        </Card>
      </div>
    );
  }
}

AdminBillingView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      tenant: PropTypes.string,
    }),
  }),
  t: PropTypes.any
}

export default withNamespaces('view_admin') (AdminBillingView);


const ListAssets = `query ListAssets($tenant: String!, $limit: Int, $nextToken: String) {
  listTenantAssets(tenant: $tenant, limit: $limit, nextToken: $nextToken ) {
      data {
          items {
              id
              symbol
              title
              totalSupply
              contractaddress
          }
          nextToken
      }
  }
}`;

const MeData = `query Me($tenantId: String) {
  me {
      userId
      user {
        id
        firstName
        lastName
        email

        tenants(tenantId: $tenantId) {
          tenantId
          tenant {
            id
            name

            billingAddress {
              company
            }
          }
        }
      }
  }
}`;