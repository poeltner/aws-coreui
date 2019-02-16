import React, { Component } from 'react';
import { Col, Row, FormGroup, Label, Input, Button, CardBody, CardFooter } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import { API, graphqlOperation } from "aws-amplify";
import Log from '../../../utils/Logger/Log';
import PropTypes from 'prop-types';
import CountrySelect from '../../../components/CountrySelect/CountrySelect';
import LanguageSelect from '../../../components/LanguageSelect/LanguageSelect';
import TimezoneSelect from '../../../components/TimezoneSelect/TimezoneSelect';
import i18n from '../../../i18n';

class ProfilePane extends Component {
  constructor(props) {
    super(props);

    this.state = {
    //   id: '',
    //   firstName: '',
    //   lastName: '',
    //   email: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    const selfData = await API.graphql(graphqlOperation(MeData));
    this.setState(selfData.data.me.user);
    Log.info('Self loaded ' + JSON.stringify(this.state), 'Profile.EditView');
  }

  async onSubmit() {
    let user = {};
    if (this.state.firstName !== null) user.firstName = this.state.firstName;
    if (this.state.lastName !== null) user.lastName = this.state.lastName;
    if (this.state.nickName !== null) user.nickName = this.state.nickName;
    if (this.state.gender !== null) user.gender = this.state.gender;
    if (this.state.timeZone !== null) user.timeZone = this.state.timeZone;
    if (this.state.country !== null) user.country = this.state.country;
    if (this.state.language !== null) user.language = this.state.language;

    const meData = await API.graphql(graphqlOperation(
      UpdateMe,
      {
        id: this.state.id,
        input: user
      },
    ));
    Log.info("Submit response: " + JSON.stringify(meData), "Profile.EditView");
  }
  
  handleInputChange(e) {
    let input = [];
    input[e.target.name] = e.target.value;
    this.setState(input);

    if (e.target.name === 'language') {
      i18n.changeLanguage(e.target.value);
    }
    Log.info('Input changed ' + JSON.stringify(this.state), 'Profile.EditView');
  }
    
  render() {
    const { t } = this.props;
    

    return (
      <div className="animated fadeIn">
        <CardBody>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="firstName" className="pr-1">{ t('common:FirstName')} / { t('common:LastName')}:</Label>
              </Col>
              <Col xs="6" md="4">
                <Input 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  value={this.state.firstName || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
              <Col xs="6" md="5">
                <Input 
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={this.state.lastName || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="lastName" className="pr-1">{ t('common:NickName')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="text"
                  name="nickName"
                  id="nickName"
                  value={this.state.nickName || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="timeZone" className="pr-1">{ t('common:TimeZone')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <TimezoneSelect 
                  name="timeZone"
                  value={this.state.timeZone || ''}
                  onChange={this.handleInputChange} 
                  />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="country" className="pr-1">{ t('common:Gender')}:</Label>
              </Col>
              <Col xs={{size: 5, offset: 1}} md={{size: 4, offset: 1}}>
                <Input 
                  type="radio"
                  name="gender"
                  id="gender"
                  value="male"
                  checked={this.state.gender === 'male'}
                  onChange={this.handleInputChange} 
                /> Male
              </Col>
              <Col xs="6" md="4">
                <Input 
                  type="radio"
                  name="gender"
                  id="gender"
                  value="female"
                  checked={this.state.gender === 'female'}
                  onChange={this.handleInputChange} 
                /> Female
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="country" className="pr-1">{ t('common:Country')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <CountrySelect 
                  name="country"
                  value={this.state.country || ''}
                  onChange={this.handleInputChange} 
                  />
              </Col>
            </FormGroup>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="language" className="pr-1">{ t('common:Language')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <LanguageSelect 
                  name="language"
                  value={this.state.language || ''}
                  onChange={this.handleInputChange} 
                  />
              </Col>
            </FormGroup>
        </CardBody>
        <CardFooter>
            <Row>
              <Col>
                <Button className="float-right" onClick={() => this.onSubmit() } color="primary"> Submit </Button>
              </Col>
            </Row>
        </CardFooter>
        <CardBody>
            <Row>
              <Col>
                <br/>
                <h5><strong>{ t('common:EmailSettings')}</strong></h5><br/>
              </Col>
            </Row>
            <FormGroup row className="pr-1">
              <Col md="3">
                <Label htmlFor="email" className="pr-1">{ t('common:Email')}:</Label>
              </Col>
              <Col xs="12" md="9">
                <Input
                  type="text"
                  name="email"
                  id="select"
                  value={this.state.email || ''}
                  onChange={this.handleInputChange} 
                />
              </Col>
            </FormGroup>
        </CardBody>
      </div>
    );
  }
}

ProfilePane.propTypes = {
  t: PropTypes.any
}

export default withNamespaces('view_profile') (ProfilePane);

const UpdateMe = `mutation UpdateUser($id: ID!, $input: UserInput!) {
  updateUser(id: $id, input: $input) {
    id
    firstName
    lastName
    nickName
    
    gender
    country

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
        nickName
        country
        gender
        timeZone
        language

        email
      }
  }
}`;
