import React from "react"
import { Button, Row, Col, Input, Table } from "reactstrap";
import PropTypes from 'prop-types';
import Log from "../../../utils/Logger/Log";
import UsersEditModal from "../modals/users.edit.modal";
import { withI18n } from "react-i18next";
import { API, graphqlOperation } from "aws-amplify";

let limit = 5;
let page = -1;

class TeamList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
             items: [],
            tenant: this.props.tenant,
            page: -1,
            prevToken: []
        }

        this.loadData = this.loadData.bind(this);
        this.resetList = this.resetList.bind(this);
        this.usersEditModal = React.createRef();
    }

    componentDidMount() {
        this.props.onRef(this)
        this.loadData();
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    async resetList() {
        page=-1;
        this.loadData();
    }

    async loadData (back = false) {
        this.setState({isLoading: true});
    
        let nextToken = null;
        if (back) {
            page-=1;
        } else {
            page+=1;
        }
        
        nextToken = this.state.prevToken[page] || null;
        const selfData = await API.graphql(graphqlOperation(MeData, { tenant: this.state.tenant, limit, nextToken}));
        if ((selfData.data.me.user.tenants !== null) 
          && (selfData.data.me.user.tenants[0].tenantId === this.state.tenant)) {
            const items = selfData.data.me.user.tenants[0].tenant.users.items || [];
            const nextToken = selfData.data.me.user.tenants[0].tenant.users.nextToken || '';
            const prevToken = this.state.prevToken;
            prevToken[page+1] = nextToken;
            Log.debug(`items ${JSON.stringify(items)}`, 'Admin.TeamList');
            this.setState({
                items,
                nextToken,
                prevToken
            })
        }
        this.setState({isLoading: false});
        // Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.TeamList');
    }
          
    render(){

        if (this.state.isLoading) {
            return "Loading...";
        }

        return (
        <div>
            <UsersEditModal reload={this.resetList} tenant={this.props.tenant} onRef={ref => (this.usersEditModal = ref)} />
            <div>
                <Row>
                    <Col xs={12}>
                        <Table responsive striped hover>
                            <thead>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Role</th>
                                <th>isAdmin</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                                { this.state.items.map((row) => (
                                    <tr key={row.userId} onClick={() => this.usersEditModal.showModal(row.userId)}>
                                        <td>{row.user.email || ''}</td>
                                        <td>{row.user.firstName || ''}</td>
                                        <td>{row.user.lastName || ''}</td>
                                        <td>{row.role || ''}</td>
                                        <td>{(row.isAdmin) ?
                                            <i className="fa fa-check-square" />
                                            :
                                            <i className="fa fa-square-o" />
                                        }</td>
                                        <td>{row.status || ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                        <Row>
                            <Col lg={5} sm={5} xs={4}>
                                <Button color="primary"  disabled={page <= 0} onClick={() => {
                                    this.loadData(true);
                                }} >Prev</Button> 
                            </Col>
                            <Col lg={2} sm={2} xs={4}>
                                <Input type="select" name="limt" value={limit} onChange={(e) => {
                                    limit = e.target.value;
                                    page = -1;
                                    this.loadData();
                                }}>
                                    <option>5</option>
                                    <option>10</option>
                                    <option>20</option>
                                    <option>50</option>
                                    <option>100</option>
                                </Input>
                            </Col>
                            
                            <Col lg={5} sm={5} xs={4}>
                                <Button color="primary" className="float-right" disabled={this.state.prevToken[page+1] === ''} onClick={() => {
                                    this.loadData();
                                }} >Next</Button>
                            </Col>
                        </Row>
            </div> 
        </div>
        );
    }
}

TeamList.propTypes = {
  query: PropTypes.string,
  tableConfig: PropTypes.any,
  tenant: PropTypes.string,
  t: PropTypes.any,
  onRef: PropTypes.func,
}

export default withI18n('view_admin') (TeamList);


const MeData = `query Me($tenant: String, $limit: Int, $nextToken: String) {
    me {
        userId
        user {
          id
          firstName
          lastName
          email
  
          tenants(tenant: $tenant) {
            tenantId
            tenant {
              id
              name
  
              tenantRoles {
                name
                inUse
                max
              }
  
              users(limit: $limit, nextToken: $nextToken) {
                items {
                  userId
                  role
                  isAdmin
                  status
                  user {
                    firstName
                    lastName
                    email
                  }
                }
                nextToken
              }
            }
          }
        }
    }
  }`;