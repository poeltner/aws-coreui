import React, { Component } from 'react';
import { FacebookButton } from './FacebookButton';
import { Auth } from 'aws-amplify';
import { JS } from '@aws-amplify/core';
// import { Strike } from 'aws-amplify-react/dist/Amplify-UI/Amplify-UI-Components-React';
import PropTypes from 'prop-types';

export class SignInSocialButtons extends Component {

    facebook(facebook_app_id) {
        if (!facebook_app_id) { return null; }

        const { onStateChange } = this.props;
        return <FacebookButton
                facebook_app_id={facebook_app_id}
                onStateChange={onStateChange}
                />;
    }


    render() {
        const { authState } = this.props;
        if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) { return null; }

        const federated = this.props.federated || {};
        if (!Auth || typeof Auth.configure !== 'function') {
            throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
        }

        const { oauth={} } = Auth.configure();
        // backward compatibility
        if (oauth['domain']) {
            federated.oauth_config = Object.assign({}, federated.oauth_config, oauth);
        } else if (oauth.awsCognito) {
            federated.oauth_config = Object.assign({}, federated.oauth_config, oauth.awsCognito);
        }

        if (oauth.auth0) {
            federated.auth0 = Object.assign({}, federated.auth0, oauth.auth0);
        }

        if (JS.isEmpty(federated)) { return null; }

        const { facebook_app_id } = federated;
        // const { google_client_id, facebook_app_id, amazon_client_id, oauth_config, auth0 } = federated;

        return (
            <div>
                {/* <Strike >or</Strike> */}
                <div>
                {/* {this.google(google_client_id)} */}
                </div>
                <div className="text-center">
                {this.facebook(facebook_app_id)}
                </div>
                <div>
                {/* {this.amazon(amazon_client_id)} */}
                </div>
                <div>
                {/* {this.OAuth(oauth_config)} */}
                </div>
                <div>
                {/* {this.auth0(auth0)} */}
                </div>
            </div>
        );
}
}
SignInSocialButtons.propTypes = {
  authState: PropTypes.string,
  federated: PropTypes.any,
  onStateChange: PropTypes.func
}
