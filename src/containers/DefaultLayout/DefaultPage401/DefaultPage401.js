import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Auth } from 'aws-amplify';
import Log from '../../../utils/Logger/Log';

class  DefaultPage401 extends Component {

  componentDidMount() {
    Auth.signOut()
    // .then(window.location.reload())
    .catch(err => Log.error(JSON.stringify(err), 'DefaultLayout.DefaultLayout'));
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <span className="clearfix">
                <h1 className="float-left display-3 mr-4">401</h1>
                <h4 className="pt-3">Deactivated</h4>
                <p className="text-muted float-left">Your account has been deactivated.</p>
              </span>
              <InputGroup className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-search"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input size="16" type="text" placeholder="What are you looking for?" />
                <InputGroupAddon addonType="append">
                  <Button color="info">Search</Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default DefaultPage401;
