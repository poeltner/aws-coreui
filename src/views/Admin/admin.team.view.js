import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button} from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types'
import TeamList from './components/TeamList';
import UserInviteModal from './modals/user.invite.modal';

class AdminTeamView extends Component {
  constructor(props) {
    super(props);

    this.state = {
        tenant: this.props.match.params.tenant,
    }
    this.userInviteModal = React.createRef();
    this.teamList = React.createRef();
  }

  render() {
    const { t } = this.props;
    

    return (
      <div className="animated fadeIn">
        <UserInviteModal reload={this.teamList.resetList} tenant={this.state.tenant} onRef={ref => (this.userInviteModal = ref)} />
        <Card>
          <CardHeader>
            <Row>
              <Col><i className="fa fa-users" /> <strong>{t('Team')}</strong> </Col>
              <Col><Button onClick={() => this.userInviteModal.toggle()} className="float-right" size="sm" color="primary"><i className="fa fa-user-plus" /> New user</Button></Col>
            </Row>
          </CardHeader>
          <CardBody>
            <TeamList 
              onRef={ref => (this.teamList = ref)} 
              tenant={this.props.match.params.tenant} 
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

AdminTeamView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      tenant: PropTypes.string,
    }),
  }),
  t: PropTypes.any
}

export default withNamespaces('view_admin') (AdminTeamView);

