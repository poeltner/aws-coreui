import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { withNamespaces } from 'react-i18next';

class AdminAdminsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
        tenant: this.props.match.params.tenant
    }
  }
  render() {
    const { t } = this.props;
    

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-font-awesome"></i> <b>Admins:</b> { this.state.tenant }
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                Tenant
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

export default withNamespaces('view_admin') (AdminAdminsView);
