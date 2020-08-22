import React from 'react';
import { Button } from 'reactstrap';
import { withFacebook } from 'aws-amplify-react';
import { Translation } from 'react-i18next';
import PropTypes from 'prop-types';

const CustomButton = (props) => (
    <Translation ns={'auth'}>
        {(t) => (
            <Button
                className="btn-facebook"
                onClick={props.facebookSignIn}
                block
            >
                {t('Sign In with Facebook')}
            </Button>
        )}
    </Translation>
);

CustomButton.propTypes = {
    facebookSignIn: PropTypes.func,
};

export const FacebookButton = withFacebook(CustomButton);
