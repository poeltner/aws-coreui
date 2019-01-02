import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import Can from '../../utils/Casl/Can';

class Casl extends Component {
  render() {
    const { t } = this.props;

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-font-awesome"></i> Casl
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <Can do="create" on="Todo">
                  <Button>Test</Button>
                </Can>
              </Col>
            </Row>
            <Row>
              <Col>
                { t('Welcome') }
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

Casl.propTypes = {
  t: PropTypes.any
}

export default withNamespaces('view_i18n') (Casl);
