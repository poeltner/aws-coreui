import React from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { ConfirmSignUp  } from 'aws-amplify-react';
import NotificationAlert from 'react-notification-alert';
import { withNamespaces } from 'react-i18next';

class DefaultConfirmSignUp  extends ConfirmSignUp  {

  error(err) {
    const { t } = this.props;
    console.log("My Error " +  JSON.stringify(err))
    const options = {
      place: 'tl',
      message: (
          <div>
              <div>
                  { (err.message)?
                      t(err.message):
                      t(err) 
                  }
              </div>
          </div> 
      ),
      type: "danger",
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7
    };
    this.refs.notify.notificationAlert(options);
  }

  render() {
    const { t } = this.props;
    const { authState } = this.props;
    if (authState !== 'confirmSignUp') {
      return null;
    }

    return (
      <div className="app flex-row align-items-center">
        <NotificationAlert ref="notify" />
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>{ t('Confirm Sign Up') }</h1>
                      <p className="text-muted">{ t('Please enter the code') }</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input  
                          placeholder={ t('common:Email') }
                          key="username"
                          name="username"
                          onChange={this.handleInputChange}
                          
                          
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input 
                            autoFocus
                            placeholder={ t('Code') }
                            key="code"
                            name="code"
                            autoComplete="off"
                            onChange={this.handleInputChange}
                        />
                        <InputGroupAddon addonType="append"><Button color="primary" className="px-0" onClick={this.resend}>{ t('Resend Code') }</Button></InputGroupAddon>
                        
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="link" className="px-0"  onClick={() => this.changeState('signIn')}>{ t('Back to Sign In') }</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="primary" className="px-4" onClick={this.confirm}>{ t('common:Confirm') }</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>{ t('Confirm Sign Up') }</h2>
                      <p>{ t('Confirm Sign Up Text') }</p>
                      <Button color="primary" className="mt-3" active onClick={() => this.changeState('signUp')}>{ t('Register Now!') }</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withNamespaces('auth') (DefaultConfirmSignUp);