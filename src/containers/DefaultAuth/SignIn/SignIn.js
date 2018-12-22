import React from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { SignIn, FederatedButtons } from 'aws-amplify-react';
import { Auth } from 'aws-amplify';
import NotificationAlert from 'react-notification-alert';

class DefaultSignIn extends SignIn {

  onClickMetaMask() {
    console.log("test");
    let id_token ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFzZGZhc2RmYTlzZGpmMGFkamYwOWFkc2pmIn0.eyJuYW1lIjoiSmFuZSBEb2UiLCJnaXZlbl9uYW1lIjoiSmFuZSIsImZhbWlseV9uYW1lIjoiRG9lIiwiZ2VuZGVyIjoiZmVtYWxlIiwiYmlydGhkYXRlIjoiMDAwMC0xMC0zMSIsImVtYWlsIjoiamFuZWRvZUBleGFtcGxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsInBpY3R1cmUiOiJodHRwOi8vZXhhbXBsZS5jb20vamFuZWRvZS9tZS5qcGciLCJub25jZSI6ImNyeXB0by12YWx1ZSIsInBob25lIjoiYXNkZmFkZiIsImlhdCI6MTU0MTExMjI1MywiZXhwIjoxNTQxMTU1NDUzLCJhdWQiOiJhc2QiLCJpc3MiOiJodHRwczovL21hZWU1czRvaDguZXhlY3V0ZS1hcGkuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb20vZGV2Iiwic3ViIjoiMjQ4Mjg5NzYxMDAxIiwianRpIjoiMzZiNDg4ZjItMDhiZi00MWYwLThlYmQtMDE4YzAwYzE2ZmE4In0.Ma6cey97Jr5foe-WeIhsivALjTF3SvX7-DXdyeTB9B49DQtZqAzjS8Jala8nDe7pWbybKx020YAe942WsaZ8BGMLf_HlTUwYFIP048gtslkwgrkHOFnE5M6XR6OxOt4Tpo6-NN-0tR--zIZyOmb0n_cLQM0PSsISqjqqcrI0f2c";
    let expires_at = '1541149446'
    Auth.federatedSignIn(
      // Initiate federated sign-in with Google identity provider 
      'maee5s4oh8.execute-api.eu-central-1.amazonaws.com/dev',
      {
          // identity_id: '248289761001',
          // the JWT token
          token: id_token, 
          // the expiration time
          // expires_at 
      },
      // // a user object
      // user
      {
        // "name": "Jane Doe",
        // "given_name": "Jane",
        // "family_name": "Doe",
        // "gender": "female",
        // "birthdate": "0000-10-31",
        // "email": "janedoe@example.com",
        // "picture": "http://example.com/janedoe/me.jpg",
        // "nonce": "asdfadsf"
      }
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
