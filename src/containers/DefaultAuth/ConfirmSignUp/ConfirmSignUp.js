import React from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { ConfirmSignUp  } from 'aws-amplify-react';
import NotificationAlert from 'react-notification-alert';

class DefaultConfirmSignUp  extends ConfirmSignUp  {

  error(err) {
    console.log("My Error " +  JSON.stringify(err))
    const options = {
      place: 'tl',
      message: (
          <div>
              <div>
                  {err.message}
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
                      <h1>Confirm Sign Up</h1>
                      <p className="text-muted">Please enter the code</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input  
                          placeholder='Email'
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
                            placeholder='Enter your code'
                            key="code"
                            name="code"
                            autoComplete="off"
                            onChange={this.handleInputChange}
                        />
                        <InputGroupAddon addonType="append"><Button color="primary" className="px-0" onClick={this.resend}>Resend Code</Button></InputGroupAddon>
                        
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="link" className="px-0"  onClick={() => this.changeState('signIn')}>Back to Sign In</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="primary" className="px-4" onClick={this.confirm}>Confirm</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Confirm Sign Up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Button color="primary" className="mt-3" active onClick={() => this.changeState('signUp')}>Register Now!</Button>
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

export default DefaultConfirmSignUp;
