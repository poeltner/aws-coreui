/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Button } from 'reactstrap';
import i18n from '../../i18n';
import LanguageSelect from '../../components/LanguageSelect/LanguageSelect';
import Log from '../../utils/Logger/Log';

class DefaultLanguageSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    // this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

//   componentWillReceiveProps(nextProps) {
//       this.setState({
//           modal: nextProps.showModal
//       });
//   }

//   toggle() {
//     this.setState({
//       modal: !this.state.modal
//     });
//   }

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

    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Change language</ModalHeader>
          <ModalBody>
            <Row>
              <Col>Change language:</Col>
              <Col><LanguageSelect 
                  name="language"
                  value={this.state.language || ''}
                  onChange={this.handleInputChange} 
                  />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.props.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DefaultLanguageSwitcher;
