import React from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { SignIn, FederatedButtons } from 'aws-amplify-react';
import { Auth } from 'aws-amplify';
import NotificationAlert from 'react-notification-alert';
import { MetamaskButton } from '../SocialButtons/MetamaskButton';

class DefaultSignIn extends SignIn {

  onClickMetaMask() {
    console.log("test");
    let id_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFzZGZhc2RmYTlzZGpmMGFkamYwOWFkc2pmIn0.eyJuYW1lIjoiSmFuZSBEb2UiLCJlbWFpbCI6ImphbmVkb2VAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhenAiOiJmOWEwZDlqZjA5YWpkZjBhc2RqZiIsInNjb3BlIjoib3BlbmlkIiwiaWF0IjoxNTQ1NTU5NDEyLCJleHAiOjE1NDU4MTg2MTIsImF1ZCI6ImY5YTBkOWpmMDlhamRmMGFzZGpmIiwiaXNzIjoiaHR0cHM6Ly9tYWVlNXM0b2g4LmV4ZWN1dGUtYXBpLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tL2RldiIsInN1YiI6IjI0ODI4OTc2MTAwMSJ9.TpJyhCXkIEzQJxkzVtmI5pUB46ZXiec8LrJMjiv96MVV305clLhT7EcrsAcGaqktegHc1xyj-TN-RKjsz8V5WtIXZ2vBbIjc4yD_wxoR861mUcRcS7_K55Xau5-2xepJCNiGOMzY_gqQm_6afdDr9Cy335ZdmzBbXaLYI62bzQkPhq7wNpV9yaL-sMxCAM5SvIE7CqOcTzs8-sOedYKUYX89cQQUwUm6-sxmx3W4CxxUH1Ue5DaLMMs9A_L7o18xQRmPOhExtaQhR0HQmjVZm2U6lozx6L_gBM0ZzydImhwVfyy3sfz8S7SdVNM6EV5rOn5R3WqzErS3aILtzi23aA";
    let expires_at = '1545817380'
    Auth.federatedSignIn(
      // Initiate federated sign-in with Google identity provider 
      'maee5s4oh8.execute-api.eu-central-1.amazonaws.com/dev',
      {
          // identity_id: '248289761001',
          // the JWT token
          token: id_token, 
          // the expiration time
          expires_at 
      },
      '248289761001'
      
  ).then(credentials => {
    console.log('get aws credentials', credentials);
  }).catch(e => {
    console.log(e);
  });
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
  
  render() {
    const { authState, federated, onStateChange } = this.props;
    if ((authState !== 'signIn') && (authState !== 'signedUp') && (authState !== 'signedOut')) {
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
                      <h1>Login</h1> 
                      <p className="text-muted">Sign In to your account</p>
                      <Button onClick={this.onClickMetaMask}>MetaMask</Button>
                      <MetamaskButton 
                        onStateChange={onStateChange}
                        serverUrl="http://localhost:4000"
                      ></MetamaskButton>
                      <FederatedButtons
                        federated={federated}
                        authState={authState}
                        onStateChange={onStateChange}
                      />
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
                      <Row>
                        <Col xs="6">
                          <Button color="link" className="px-0" onClick={() => this.changeState('forgotPassword')}>Forgot password?</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="primary" className="px-4" onClick={this.signIn}>Login</Button>
                          
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
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

export default DefaultSignIn;
