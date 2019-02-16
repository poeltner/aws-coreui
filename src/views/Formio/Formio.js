import React, { Component } from 'react';
// import { Card, CardBody, CardHeader, Col, Row, Button } from 'reactstrap';
// import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
// import Can from '../../utils/Casl/Can';
import {FormBuilder} from 'react-formio';
 
class Formio extends Component {
  render() {
    // const { t } = this.props;
 
    return (
    <FormBuilder form={{display: 'form'}} onChange={(schema) => console.log(schema)} />
    );
  }
} 

Formio.propTypes = {
  t: PropTypes.any
}

export default Formio;
