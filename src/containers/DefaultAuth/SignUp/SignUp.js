import React from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { SignUp } from 'aws-amplify-react';
import NotificationAlert from 'react-notification-alert';

class DefaultSignUp extends SignUp {
  constructor(props) {
    super(props);
    this.onSignUp = this.onSignUp.bind(this);
  }

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

  onSignUp() {
    if (this.inputs.password === this.inputs.repeatpassword) {
      this.inputs.email = this.inputs.username;
      this.signUp();
    } else {
      console.log("Passwords do not match");
      this.error({message:"Passwords do not match"});
    }
  }

  render() {

    const { authState } = this.props;
    if (authState !== 'signUp') {
      return null;
    }

    return (
      <div className="app flex-row align-items-center">
        <NotificationAlert ref="notify" />
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        type="text" 
                        placeholder="Email" 
                        autoComplete="username"
                        autoFocus
                        key="username"
                        name="username"
                        onChange={this.handleInputChange}
                         />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        autoComplete="password"
                        key="password"
                        name="password"
                        onChange={this.handleInputChange}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        type="password" 
                        placeholder="Repeat Password" 
                        autoComplete="password"
                        key="repeatpassword"
                        name="repeatpassword"
                        onChange={this.handleInputChange}
                      />
                    </InputGroup>
                    <Row>
                        <Col xs="6">
                          <Button color="link" className="px-0" onClick={() => this.changeState('signIn')}>Have an account? Sign in</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="success" className="px-4" onClick={this.onSignUp}>Register</Button>
                        </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default DefaultSignUp;
