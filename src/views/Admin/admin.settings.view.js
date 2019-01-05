import React, { Component } from 'react';
import { Label, Card, CardBody, CardFooter, CardHeader, Col, Button, Input, FormGroup } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types'
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../utils/Logger/Log';
import { withAlert } from '../../utils/Alert/alert';
class AdminSettingsView extends Component {constructor(props) {
    super(props);

    this.state = {
        tenant: this.props.match.params.tenant,
        input: { }
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData () {
    this.setState({isLoading: true});
    const selfData = await API.graphql(graphqlOperation(MeData, { tenant: this.state.tenant}));
    if ((selfData.data.me.user.tenants !== null) 
      && (selfData.data.me.user.tenants[0].tenantId === this.state.tenant)) {
        this.setState({
            input: selfData.data.me.user.tenants[0].tenant,
            isLoading: false
          })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.BillingAddressModal');
  }

  async onClickUpdate() {
    const requestUpdate = {
      name: this.state.input.name,
      description: this.state.input.description,
    }
    const tenant = await API.graphql(graphqlOperation(UpdateTenant, { tenantId: this.state.tenant, input: requestUpdate}));
    if (tenant.data)
      this.props.alert("Updated")
    else 
      this.props.errorAlert("Error when updating, please try again later")
  }

  async onClickCancel() {
    this.loadData();
    this.props.alert("Data reloaded");
  }

  handleInputChange(e) {
    const input = this.state.input;
    input[e.target.name] = e.target.value;
    this.setState({input});
  }


  render() {
    const { t } = this.props;
    

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-font-awesome"></i> <b>Settings:</b> { this.state.tenant }
          </CardHeader>
          { this.state.isLoading ?
            <div className="animated fadeIn pt-3 text-center">
              Loading...
            </div>
            :
          <CardBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="name" className="pr-1">{ t('Name')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="name" 
                  id="name" 
                  value={this.state.input.name || ''} 
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="description" className="pr-1">{ t('Description')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="input" 
                  name="description" 
                  id="description" 
                  value={this.state.input.description || '' }
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
          </CardBody>
          }
          <CardFooter>
            <Button color="primary" onClick={() => this.onClickUpdate()}>{ t('common:Change') }</Button>
            <Button color="secondary" onClick={() => this.onClickCancel()}>{ t('common:Cancel') }</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

AdminSettingsView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      tenant: PropTypes.string,
    }),
  }),
  t: PropTypes.any,
  alert: PropTypes.func,
  errorAlert: PropTypes.func
}

export default withNamespaces('view_admin') (withAlert(AdminSettingsView));

const MeData = `query Me($tenant: String) {
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
            description
          }
        }
      }
  }
}`;

const UpdateTenant = `mutation UpdateTenant($tenantId: ID!, $input: TenantInput!) {
  updateTenant(tenantId: $tenantId, input: $input) {
    id
    name
    description
    billingAddress {
      company
    }
  }
}`