import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import { SignIn } from "aws-amplify-react";
import NotificationAlert from "react-notification-alert";
import { SignInSocialButtons } from "../SocialButtons/SignInSocialButtons";
import { withTranslation } from "react-i18next";
import Log from "../../../utils/Logger/Log";

class DefaultSignIn extends SignIn {
  constructor(props) {
    super(props);

    this.state = {
      isLoggingIn: false
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  error(err) {
    const { t } = this.props;
    Log.error(err, "DefaultAuth.SignIn");
    const options = {
      place: "tl",
      message: (
        <div>
          <div>{err.message ? t(err.message) : t(err)}</div>
        </div>
      ),
      type: "danger",
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7
    };
    this.notify.notificationAlert(options);
  }

  async onSignIn() {
    if (!this.inputs.username) {
      this.error("Username cannot be empty");
    } else if (!this.inputs.password) {
      this.error("Password cannot be empty");
    } else {
      this.setState({ isLoggingIn: true });
      await this.signIn();
      this.setState({ isLoggingIn: false });
    }
  }

  render() {
    const { t } = this.props;
    const { authState, federated, onStateChange } = this.props;
    if (
      authState !== "signIn" &&
      authState !== "signedUp" &&
      authState !== "signedOut"
    ) {
      return null;
    }

    return (
      <div className="app flex-row align-items-center">
        <NotificationAlert
          ref={c => {
            this.notify = c;
          }}
        />
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>{t("common:Login")}</h1>
                      <p className="text-muted">
                        {t("Sign In to your account")}
                      </p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          autoFocus
                          placeholder={t("common:Email")}
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
                          placeholder={t("common:Password")}
                          key="password"
                          type="password"
                          name="password"
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="link"
                            className="px-0"
                            onClick={() => this.changeState("forgotPassword")}
                          >
                            {t("Forgot password?")}
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button
                            color="primary"
                            className="px-4"
                            onClick={this.onSignIn}
                          >
                            {t("common:Login")}{" "}
                            {this.state.isLoggingIn ? (
                              <i className="fa fa-spin fa-circle-o-notch" />
                            ) : null}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    <SignInSocialButtons
                      onStateChange={onStateChange}
                      federated={federated}
                      authState={authState}
                    />
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5">
                  <CardBody className="text-center">
                    <div>
                      <h2>{t("Sign Up")}</h2>
                      <p>{t("Sign Up Text")}</p>
                      <Button
                        color="primary"
                        className="mt-3"
                        active
                        onClick={() => this.changeState("signUp")}
                      >
                        {t("Register!")}
                      </Button>
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

// export default DefaultSignIn;
export default withTranslation("auth", { wait: true })(DefaultSignIn);
