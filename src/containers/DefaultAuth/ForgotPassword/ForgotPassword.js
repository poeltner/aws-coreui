import React from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { ForgotPassword  } from 'aws-amplify-react';
import NotificationAlert from 'react-notification-alert';
import { withTranslation } from 'react-i18next';
import Log from '../../../utils/Logger/Log';

class DefaultForgotPassword  extends ForgotPassword  {
  constructor(props) {
    super(props);
    this.state = {
      isRequestingPassword: false,
      isSubmittingPassword: false
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onRequestPassword = this.onRequestPassword.bind(this);
  }

  error(err) {
    const { t } = this.props;
    Log.error(err, 'DefaultAuth.ForgotPassword');
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

  async onSubmit() {
    this.setState({ isSubmittingPassword : true });
    await this.submit();
    this.setState({ isSubmittingPassword : false });
  }
  
  async onRequestPassword() {
    this.setState({ isRequestingPassword : true });
    await this.send();
    this.setState({ isRequestingPassword : false });
  }

  sendView() {
    const { t } = this.props;
      return (
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="icon-user"></i>
            </InputGroupText>
          </InputGroupAddon>
          <Input  
              autoFocus
              placeholder={ t('common:Email') }
              key="username"
              name="username"
              onChange={this.handleInputChange} />
        </InputGroup>
      );
  }

  submitView() {
    const { t } = this.props;
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
                    placeholder={ t('Code') }
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
                    placeholder={ t('common:Password') }
                    key="password"
                    type="password"
                    name="password"
                    onChange={this.handleInputChange} />
              </InputGroup>
          </div>
      );
  }


  render() {
    const { t } = this.props;
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
                      <h1>{ t('Forgot Password') }</h1>
                      <p className="text-muted">{ t('Reset your password') }</p>
                      { this.state.delivery? this.submitView() : this.sendView() }
                      <Row>
                        <Col xs="6">
                          <Button color="link" className="px-0" onClick={() => {this.setState({delivery:false}); this.changeState('signIn')}}>{ t('Back to Sign in') }</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          { this.state.delivery ? 
                              <Button color="primary" className="px-4" onClick={this.onSubmit}>{ t('common:Submit') }{' '} 
                              { (this.state.isSubmittingPassword) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button> :
                              <Button color="primary" className="px-4" onClick={this.onRequestPassword}>{ t('Request') }{' '} 
                              { (this.state.isRequestingPassword) ? <i className="fa fa-spin fa-circle-o-notch"/>: null }</Button>
                          }  
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>{ t('Forgot Password') }</h2>
                      <p>{ t('Forgot Password Text') }</p>
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

export default withTranslation('auth') (DefaultForgotPassword);