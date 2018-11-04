import React from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { RequireNewPassword  } from 'aws-amplify-react';
import NotificationAlert from 'react-notification-alert';

class DefaultRequireNewPassword   extends RequireNewPassword   {

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
    if (authState !== 'requireNewPassword') {
      return null;
    }

    const user = this.props.authData;
    const { requiredAttributes } = user.challengeParam;

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
                      <h1>Change Password</h1>
                      <p className="text-muted">Password change required</p>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input 
                            placeholder="Password"
                            key="password"
                            type="password"
                            name="password"
                            onChange={this.handleInputChange} />
                      </InputGroup>
                      {requiredAttributes
                        .map(attribute => (
                            <Input
                                placeholder={attribute}
                                key={attribute}
                                name={attribute}
                                type="text"
                                onChange={this.handleInputChange}
                            />
                        ))}
                      <Row>
                        <Col xs="6">
                          
                          <Button color="link" className="px-0" onClick={() => this.changeState('signIn')}>Back to Sign in</Button>
                          
                          
                        </Col>
                        <Col xs="6" className="text-right">
                              <Button color="primary" className="px-4" onClick={this.change}>Change</Button> 
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Require new Password</h2>
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

export default DefaultRequireNewPassword;
