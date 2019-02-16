import React, { Component } from 'react';
import { Container, Card, CardBody, CardHeader, Col, Row, FormGroup, Label, Input, Button } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../utils/Logger/Log';
import PropTypes from 'prop-types';

class DefaultRegisterTenant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      description: null
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async onSubmit() {

    const meData = await API.graphql(graphqlOperation(
        CreateTenant,
      {
        tenantId: this.state.name,
        input: {
            name: this.state.name,
            description: this.state.description,
        } 
      },
    ));

    Log.info("Submit response: " +JSON.stringify(meData), "DefaultRegistration.DefaultRegisterTenant");
    
    if (meData.data.createTenant.id !== null) {
        
        await localStorage.setItem('tenant', meData.data.createTenant.id);
        this.props.reload();
    }
  }
  
  handleInputChange(e) {
    let input = [];
    input[e.target.name] = e.target.value;
    this.setState(input);
    Log.info('Input changed ' + JSON.stringify(this.state), 'Profile.EditView');
  }
    
  render() {
    const { t } = this.props;
    

    return (
        <div className="app">
            <div className="app-body">
                <main className="main">       
                    <Container fluid>
                        <div className="animated fadeIn">
                            <Card>
                            <CardHeader>
                                <i className="fa fa-font-awesome"></i> <b>Create Tenant</b> 
                            </CardHeader>
                            <CardBody>
                            <FormGroup row className="pr-1">
                                <Col md="3">
                                    <Label htmlFor="name" className="pr-1">{ t('common:TenantName')}:</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    value={this.state.name || ''}
                                    onChange={this.handleInputChange} 
                                    />
                                </Col>
                                </FormGroup>
                                <FormGroup row className="pr-1">
                                <Col md="3">
                                    <Label htmlFor="description" className="pr-1">{ t('common:Description')}:</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input 
                                    type="text" 
                                    name="description" 
                                    id="description" 
                                    value={this.state.description || ''}
                                    onChange={this.handleInputChange} 
                                    />
                                </Col>
                                </FormGroup>
                                <Row>
                                <Col>
                                    <Button onClick={() => this.onSubmit() }> Submit </Button>
                                </Col>
                                </Row>
                            </CardBody>
                            </Card>
                        </div>
                    </Container>
                </main>
            </div>
        </div>
    );
  }
}

DefaultRegisterTenant.propTypes = {
  t: PropTypes.any,
  reload: PropTypes.func,
}

export default withNamespaces('view_register') (DefaultRegisterTenant);

const CreateTenant = `mutation CreateTenant($tenantId: ID!, $input: TenantInput!) {
  createTenant(tenantId: $tenantId, input: $input) {
    id
    name
    description
  }
}`;


