import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, FormGroup, Label, Input, Button } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../utils/Logger/Log';
import PropTypes from 'prop-types';

class ProfileEditView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      firstName: '',
      lastName: '',
      email: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    const selfData = await API.graphql(graphqlOperation(MeData));
    this.setState({ 
      id: selfData.data.me.userId,
      firstName: selfData.data.me.user.firstName,
      lastName: selfData.data.me.user.lastName,
      email: selfData.data.me.user.email,
    });
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Profile.EditView');
  }

  async onSubmit() {
    const meData = await API.graphql(graphqlOperation(
      UpdateMe,
      {
        id: this.state.id,
        input: {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
        } 
      },
    ));
    Log.info("Submit response: " + JSON.stringify(meData), "Profile.EditView");
  }
  
  handleInputChange(e) {
    let input = [];
    input[e.target.name] = e.target.value;
    this.setState(input);
    Log.info('Input changed ' + JSON.stringify(this.state), 'Profile.EditView');
  }
    
  render() {
    const { t } = this.props;
    

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-font-awesome"></i> <b>Profile:</b> 
          </CardHeader>
          <CardBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="firstName" className="pr-1">{ t('common:FirstName')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  value={this.state.firstName}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="lastName" className="pr-1">{ t('common:LastName')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={this.state.lastName}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="email" className="pr-1">{ t('common:Email')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input
                  type="text"
                  name="email"
                  id="select"
                  value={this.state.email}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <Row>
              <Col>
                <Button onClick={() => this.onSubmit() }> Submit </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

ProfileEditView.propTypes = {
  t: PropTypes.any
}

export default withNamespaces('view_profile') (ProfileEditView);

const UpdateMe = `mutation UpdateUser($id: ID!, $input: UserInput!) {
  updateUser(id: $id, input: $input) {
    id
    firstName
    lastName
    email

    tenants {
      tenantId

      tenant {
        id
        name
      }
    }
  }
}`;

const MeData = `query Me {
  me {
      userId
      user {
        id
        firstName
        lastName
        email
      }
  }
}`;
