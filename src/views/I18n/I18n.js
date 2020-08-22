import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import i18n from '../../i18n';

class I18n extends Component {
  render() {
    const { t } = this.props;
    
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-font-awesome"></i> I18n
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                Change language: <Button color="link" onClick={() => changeLanguage('de')}>de</Button> | <Button color="link" onClick={() => changeLanguage('en')}>en</Button>
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

export default withTranslation('view_i18n') (I18n);
