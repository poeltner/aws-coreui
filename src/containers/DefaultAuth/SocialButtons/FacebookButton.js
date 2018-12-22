
import React from 'react';
import { Button } from 'reactstrap';
import withFacebook from 'aws-amplify-react/dist/Auth/Provider/withFacebook';

const CustomButton = (props) => (
    <Button
        className="btn-facebook"
        onClick={props.facebookSignIn}
        block
    >
        Sign In with Facebook
    </Button>
);

export const FacebookButton = withFacebook(CustomButton);