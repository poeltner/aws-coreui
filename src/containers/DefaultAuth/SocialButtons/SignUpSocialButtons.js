import React, { Component } from 'react';
import { FacebookButton } from './FacebookButton';
import { Auth } from 'aws-amplify';
import { JS } from '@aws-amplify/core';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

export class SignUpSocialButtons extends Component {

    facebook(facebook_app_id) {
        if (!facebook_app_id) { return null; }

        const { onStateChange } = this.props;
        return <Col xs="12" sm="6">
                    <FacebookButton
                    facebook_app_id={facebook_app_id}
                    onStateChange={onStateChange}
                    />
                </Col>;
    }


    render() {
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
            <Row>
                {this.facebook(facebook_app_id)}
            </Row>
        );
}
}
SignUpSocialButtons.propTypes = {
  federated: PropTypes.any,
  onStateChange: PropTypes.func
}
