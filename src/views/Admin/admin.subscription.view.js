import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, FormGroup, Input, Label, Button } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import logo from '../../assets/img/brand/logo.svg'
import { Link } from 'react-router-dom';

class AdminSubscriptionView extends Component {constructor(props) {
    super(props);

    this.state = {
        tenant: this.props.match.params.tenant
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    let input = [];
    input[e.target.name] = e.target.value;

    this.setState(input);
  }

  render() {
    const { t } = this.props;
    

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg="8">
            <Card>
              <CardBody>
                <Row>
                  <Col lg="4">
                    <img src={logo} alt="logo" style={{width: '80%'}} />
                  </Col>
                  <Col lg="4">
                    <Input type="select" name="period" id="select" onChange={this.handleInputChange}>
                      <option value="month">{ t('Regular')}</option>
                      <option value="year">{ t('Yearly')}</option>
                    </Input>
                  </Col>
                  <Col lg="2">
                    <Input size="3"/>
                  </Col>
                  <Col lg="2">
                    <h4>87 $</h4>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card>
              <CardHeader>
                <strong>{ t('Your subscription') }</strong>
              </CardHeader>
              <CardBody>
                  <FormGroup row className="pr-1">
                    <Col md="3">
                      <Label htmlFor="select" className="pr-1">{ t('Billing')}:</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="period" id="select" onChange={this.handleInputChange}>
                        <option value="">{ t('common:PleaseSelect')}</option>
                        <option value="month">{ t('Monthly')}</option>
                        <option value="year">{ t('Yearly')}</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  { this.state.period === "month"  &&
                    <Row >
                      <Col>
                      { t('Save if you buy yearly')}
                      </Col>
                    </Row>
                  }
                  <Row>
                    <Col>
                      <hr/>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      &nbsp;
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="8">
                      <strong>Support Regular</strong><br/>
                      Agenten: 3
                    </Col>
                    <Col lg="4">
                      <h4><strong>87 $</strong></h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      &nbsp;
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="8">
                      <strong>Support Regular</strong><br/>
                      Agenten: 3
                    </Col>
                    <Col lg="4">
                      <h4><strong>87 $</strong></h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      &nbsp;
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <hr/>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="8">
                      <strong>{ t('Total')} </strong><br/>
                      inkl. Ust
                    </Col>
                    <Col lg="4">
                      <h4><strong>87 $</strong></h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      &nbsp;
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button color="primary" style={{width:'100%'}}>Update subscription</Button>
                    </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Card>
              <CardHeader>
                <strong>Sie möchten Ihr Konto kündigen?</strong>
              </CardHeader>
              <CardBody>
                Nach der Kündigung Ihres Kontos können Sie Zendesk Support nicht mehr verwenden und nicht mehr auf Ihre Kontodaten zugreifen. 
                <br/> <Link to="">Ja, Konto kündigen</Link>
              </CardBody>
            </Card>
      </div>
    );
  }
}

export default withNamespaces('view_admin') (AdminSubscriptionView);
