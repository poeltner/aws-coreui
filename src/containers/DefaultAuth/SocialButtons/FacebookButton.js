
import React from 'react';
import { Button } from 'reactstrap';
import withFacebook from 'aws-amplify-react/dist/Auth/Provider/withFacebook';
import { NamespacesConsumer } from 'react-i18next';

const CustomButton = (props) => (
    <NamespacesConsumer ns={'auth'}>
    {
      (t) => (
            <Button
                className="btn-facebook"
                onClick={props.facebookSignIn}
                block
            >
                { t('Sign In with Facebook') }
            </Button>
      )
    }
  </NamespacesConsumer>
);

export const FacebookButton = withFacebook(CustomButton);