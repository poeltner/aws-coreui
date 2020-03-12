import React from "react";
import { Button } from "reactstrap";
import { withFacebook } from "aws-amplify-react";
import { NamespacesConsumer } from "react-i18next";
import PropTypes from "prop-types";

const CustomButton = props => (
  <NamespacesConsumer ns={"auth"}>
    {t => (
      <Button className="btn-facebook" onClick={props.facebookSignIn} block>
        {t("Sign In with Facebook")}
      </Button>
    )}
  </NamespacesConsumer>
);

CustomButton.propTypes = {
  facebookSignIn: PropTypes.func
};

export const FacebookButton = withFacebook(CustomButton);
