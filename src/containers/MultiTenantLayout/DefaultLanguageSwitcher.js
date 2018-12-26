/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import i18n from '../../i18n';

class DefaultLanguageSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    // this.toggle = this.toggle.bind(this);
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

  render() {

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }

    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
            Change language: <Button color="link" onClick={() => changeLanguage('de')}>de</Button> | <Button color="link" onClick={() => changeLanguage('en')}>en</Button>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DefaultLanguageSwitcher;
