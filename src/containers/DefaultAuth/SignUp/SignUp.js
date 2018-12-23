import React from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { SignUp } from 'aws-amplify-react';
import { JS } from '@aws-amplify/core';
import NotificationAlert from 'react-notification-alert';
import { SignUpSocialButtons } from '../SocialButtons/SignUpSocialButtons';
import { withNamespaces } from 'react-i18next';

class DefaultSignUp extends SignUp {
  constructor(props) {
    super(props);
    this.onSignUp = this.onSignUp.bind(this);
  }

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
    const { t } = this.props;
    const { authState, federated, onStateChange } = this.props;
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
                    <h1>{ t('common:Register') }</h1>
                    <p className="text-muted">{ t('Create your account') }</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        type="text" 
                        placeholder={ t('common:Email') } 
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
                        placeholder={ t('common:Password') } 
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
                        placeholder={ t('common:RepeadPassword') }
                        autoComplete="password"
                        key="repeatpassword"
                        name="repeatpassword"
                        onChange={this.handleInputChange}
                      />
                    </InputGroup>
                    <Row>
                        <Col xs="6">
                          <Button color="link" className="px-0" onClick={() => this.changeState('signIn')}>{ t('Have an account? Sign in') }</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="success" className="px-4" onClick={this.onSignUp}>{ t('common:Register') }</Button>
                        </Col>
                    </Row>
                  </Form>
                </CardBody>
                { (!JS.isEmpty(federated))?
                  <CardFooter className="p-4">
                    <SignUpSocialButtons
                      onStateChange={onStateChange}
                      federated={federated}
                      authState={authState}
                    />
                  </CardFooter>
                  :
                  null
                }
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withNamespaces('auth') (DefaultSignUp);