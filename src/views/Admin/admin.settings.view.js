import React, { Component } from 'react';
import { Label, Card, CardBody, CardFooter, CardHeader, Col, Button, Input, FormGroup, FormFeedback } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types'
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../utils/Logger/Log';
import { withAlert } from '../../utils/Alert/alert';
class AdminSettingsView extends Component {constructor(props) {
    super(props);

    this.state = {
        tenant: this.props.match.params.tenant,
        validate: {},
        isUpdating: false,
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
            name: selfData.data.me.user.tenants[0].tenant.name,
            description: selfData.data.me.user.tenants[0].tenant.description,
            isLoading: false
          })
    }
    this.setState({isLoading: false});
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.SettingsView');
  }

  async onClickUpdate() {
    this.setState({isUpdating:true});
    const requestUpdate = {
      name: this.state.name,
      description: this.state.description,
    }
    const tenant = await API.graphql(graphqlOperation(UpdateTenant, { tenant: this.state.tenant, input: requestUpdate}));
    if (tenant.data)
      this.props.alert(this.props.t('Settings updated'));
    else 
      this.props.errorAlert(this.props.t('Error when updating, please try again later'));
      this.setState({isUpdating:false});
  }

  async onClickCancel() {
    this.loadData();
    this.props.alert(this.props.t('Changes reseted'));
  }

  async handleInputChange(e) {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [ name ]: value,
    });
  }
  async validateMinCharacter(e, characters) {
    const { validate } = this.state
    if (e.target.value.length >= characters) {
      validate[e.target.name] = 'has-success';
    } else {
      validate[e.target.name] = 'has-error';
    }
    this.setState({ validate })
  }


  render() {
    const { t } = this.props;

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-cogs"></i> <b>{t('Settings for')} { this.state.tenant }</b> 
          </CardHeader>
          { this.state.isLoading ?
            <div className="animated fadeIn pt-3 text-center">
              { t('Loading ...') }
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
                  value={this.state.name || ''} 
                  onChange={(e) => {
                    this.validateMinCharacter(e,3);
                    this.handleInputChange(e);
                  }}
                  valid={ this.state.validate.name === 'has-success' }
                  invalid={ this.state.validate.name === 'has-error' }
                />
                <FormFeedback>
                  { t('Name need to have at least 3 characters')}
                </FormFeedback>
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
                  value={this.state.description || '' }
                  onChange={(e) => {
                    this.validateMinCharacter(e,3);
                    this.handleInputChange(e);
                  }}
                  valid={ this.state.validate.description === 'has-success' }
                  invalid={ this.state.validate.description === 'has-error' }
                />
                <FormFeedback>
                  { t('Name need to have at least 3 characters')}
                </FormFeedback>
              </Col>
            </FormGroup>
          </CardBody>
          }
          <CardFooter>
            <Button className="float-right" color="secondary" onClick={() => this.onClickCancel()}>{ t('common:Cancel') }</Button>
            <Button className="float-right" color="primary" onClick={() => this.onClickUpdate()}>{ t('common:Change') }{' '} 
                  { (this.state.isUpdating) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
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

const UpdateTenant = `mutation UpdateTenant($tenant: ID!, $input: TenantInput!) {
  updateTenant(tenant: $tenant, input: $input) {
    id
    name
    description
  }
}`