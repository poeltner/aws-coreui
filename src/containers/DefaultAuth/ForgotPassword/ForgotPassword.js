import React from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { ForgotPassword  } from 'aws-amplify-react';
import NotificationAlert from 'react-notification-alert';

class DefaultForgotPassword  extends ForgotPassword  {

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

  onSubmit() {
    if (this.inputs.password === this.inputs.repeatpassword) {
      this.inputs.email = this.inputs.username;
      this.submit();
    } else {
      console.log("Passwords do not match");
      this.error({message:"Passwords do not match"});
    }
  }

  sendView() {
      return (
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="icon-user"></i>
            </InputGroupText>
          </InputGroupAddon>
          <Input  
              autoFocus
              placeholder="Email"
              key="username"
              name="username"
              onChange={this.handleInputChange} />
        </InputGroup>
      );
  }

  submitView() {
      return (
          <div>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-user"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input  
                    autoFocus
                    placeholder="Code"
                    key="code"
                    name="code"
                    autoComplete="off"
                    onChange={this.handleInputChange} 
                  />
                <InputGroupAddon addonType="append"><Button color="primary" className="px-0" onClick={this.send}>&nbsp; Resend Code &nbsp;</Button></InputGroupAddon>
              </InputGroup>
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
              <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-lock"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input 
                    placeholder="Repeat Password"
                    key="repeatpassword"
                    type="password"
                    name="repeatpassword"
                    onChange={this.handleInputChange} />
              </InputGroup>
          </div>
      );
  }


  render() {
    const { authState } = this.props;
    if (authState !== 'forgotPassword') {
      return null;
    }
    // if (hide && hide.includes(SignIn)) { return null; }

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
                      <h1>Forgot Password</h1>
                      <p className="text-muted">Reset your password</p>
                      { this.state.delivery? this.submitView() : this.sendView() }
                      <Row>
                        <Col xs="6">
                          <Button color="link" className="px-0" onClick={() => {this.setState({delivery:false}); this.changeState('signIn')}}>Back to Sign in</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          { this.state.delivery ? 
                              <Button color="primary" className="px-4" onClick={this.onSubmit}>Submit</Button> :
                              <Button color="primary" className="px-4" onClick={this.send}>Send Code</Button>
                          }  
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Forgot Password</h2>
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

export default DefaultForgotPassword;
