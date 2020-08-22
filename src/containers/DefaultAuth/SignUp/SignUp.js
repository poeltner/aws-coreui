import React from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { SignUp } from 'aws-amplify-react';
import { JS } from '@aws-amplify/core';
import NotificationAlert from 'react-notification-alert';
import { SignUpSocialButtons } from '../SocialButtons/SignUpSocialButtons';
import { withTranslation } from 'react-i18next';
import Log from '../../../utils/Logger/Log';

class DefaultSignUp extends SignUp {
  constructor(props) {
    super(props);
    this.state = {
      validate: {},
      isSigningUp: false,
    }
    this.onSignUp = this.onSignUp.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validateEqual = this.validateEqual.bind(this);
    this.validateMinCharacter = this.validateMinCharacter.bind(this);
  }

  error(err) {
    const { t } = this.props;
    Log.error(err, 'DefaultAuth.SignUp');
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
    this.notify.notificationAlert(options);
  }

  async validateMinCharacter(e, characters) {
    const { validate } = this.state
    if (e.target.value.length >= characters) {
      validate[e.target.name] = 'has-success';
    } else {
      validate[e.target.name] = 'has-error';
    }
    this.setState({ validate })
  }

  
  validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
    if (emailRex.test(e.target.value)) {
      validate[e.target.name] = 'has-success';
    } else {
      validate[e.target.name] = 'has-error';
    }
    this.setState({ validate })
  }

  validateEqual(e, compare) {
    const { validate } = this.state
    if (e.target.value === compare) {
      validate[e.target.name] = 'has-success';
    } else {
      validate[e.target.name] = 'has-error';
    }
    this.setState({ validate })
  }

  async onSignUp() {
    if ((this.state.validate.email === 'has-success') && 
      (this.state.validate.password === 'has-success') &&
      (this.state.validate.repeatpassword === 'has-success')) {
      this.inputs.username = this.inputs.email;
      this.setState({ isSigningUp: true });
      await this.signUp();
      this.setState({ 
        isSigningUp: false,
        validate: {}
      });
    } 
  }

  render() {
    const { t } = this.props;
    const { authState, federated, onStateChange } = this.props;
    if (authState !== 'signUp') {
      return null;
    }
    
  
    if (this.checkCustomSignUpFields()) {
      this.signUpFields = this.props.signUpConfig.signUpFields;
    }
    this.sortFields();
    return (
      <div className="app flex-row align-items-center">
        <NotificationAlert ref={(c) => { this.notify = c; }} />
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
                        autoComplete="email"
                        autoFocus
                        key="email"
                        name="email"
                        onChange={ (e) => {
                          this.validateEmail(e)
                          this.handleInputChange(e)
                        }}
                        valid={ this.state.validate.email === 'has-success' }
                        invalid={ this.state.validate.email === 'has-error' }
                        />
                      <FormFeedback>
                        { t('Please enter a correct email address.') }
                      </FormFeedback>
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
                        onChange={ (e) => {
                          this.validateMinCharacter(e,8)
                          this.handleInputChange(e)
                        }}
                        valid={ this.state.validate.password === 'has-success' }
                        invalid={ this.state.validate.password === 'has-error' }
                      />
                      <FormFeedback>
                        { t('Password must have at least 8 characters.') } 
                      </FormFeedback>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        type="password" 
                        placeholder={ t('common:ConfirmPassword') }
                        autoComplete="password"
                        key="repeatpassword"
                        name="repeatpassword"
                        onChange={ (e) => {
                          this.validateEqual(e,this.inputs.password)
                        }}
                        valid={ this.state.validate.repeatpassword === 'has-success' }
                        invalid={ this.state.validate.repeatpassword === 'has-error' }
                      
                      />
                      <FormFeedback>
                      { t('Password and confirm password does not match.') }
                      </FormFeedback>
                    </InputGroup>
                    <Row>
                        <Col xs="6">
                          <Button color="link" className="px-0" onClick={() => this.changeState('signIn')}>{ t('Have an account? Sign in') }</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="success" className="px-4" onClick={this.onSignUp}>{ t('common:Register') }{' '} 
                        { (this.state.isSigningUp) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
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

export default withTranslation('auth') (DefaultSignUp);