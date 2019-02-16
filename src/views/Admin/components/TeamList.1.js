import React from "react"
import { Button, Row, Col, Input } from "reactstrap";
import { Connect } from "aws-amplify-react";
import { graphqlOperation } from "aws-amplify";
import BootstrapTable from 'react-bootstrap-table-next';
import PropTypes from 'prop-types';
import Log from "../../../utils/Logger/Log";
import UsersEditModal from "../modals/users.edit.modal";
import { withI18n } from "react-i18next";

let limit = 5;

class TeamList extends React.Component{

    constructor(props) {
        super(props);

        this.GET_QUERY = this.props.query;

        let qlprops = {}
        if (this.props.tenant != null)  { 
            qlprops = {tenant: this.props.tenant, limit};
        } else {
            qlprops ={limit};
        }

        this.state = {
            query: graphqlOperation(this.props.query, qlprops), 
            page: 0,
            filterTitle: '',
            qlprops,
            index: 0
        }

        this.rowEvents.onClick =  this.rowEvents.onClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.usersEditModal = React.createRef();
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    async handleInputChange(e) {
        const { target } = e;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await this.setState({
          [ name ]: value,
        });
    }

    async loadData() {
        await this.setState({
            query: graphqlOperation(this.GET_QUERY, {tenant: this.props.tenant, limit, index: this.state.index }),
            index: this.state.index + 1
        })
    }

    tableConfig = {
        columns: [
            {
                dataField: 'user.email',
                text: this.props.t('Email'),
                headerStyle: () => {
                    return { width: '25%', textAlign: 'left' };
                }
            },
            {
                dataField: 'user.firstName',
                text: this.props.t('First Name'),
                headerStyle: () => {
                    return { width: '20%', textAlign: 'left' };
                }
            },
            {
                dataField: 'user.lastName',
                text: this.props.t('Last Name'),
                headerStyle: () => {
                    return { width: '20%', textAlign: 'left' };
                }
            },
            {
                dataField: 'role',
                text: this.props.t('Role'),
                headerStyle: () => {
                    return { width: '15%', textAlign: 'left' };
                }
            },
            {
                dataField: 'isAdmin',
                text: this.props.t('Admin'),
                headerStyle: () => {
                    return { width: '10%', textAlign: 'center' };
                },
                formatter: this.isAdminFormater,
                style: { textAlign: 'center' },
            },
            {
                dataField: 'status',
                text: this.props.t('Status'),
                headerStyle: () => {
                    return { width: '10%', textAlign: 'right' };
                },
                style: { textAlign: 'right' },
            }
          
    
        ]
      }

    isAdminFormater(cell) {
        if (cell)
            return <i className="fa fa-check-square" />
        else 
            return <i className="fa fa-square-o" />
    }

    rowEvents = {
        onClick: (e, row) => {
            this.usersEditModal.showModal(row.userId);
        }
    }; 
      
    render(){
        let prevToken = [];

        return (
        <div>
          <UsersEditModal reload={this.loadData} tenant={this.props.tenant} onRef={ref => (this.usersEditModal = ref)} />
          <Connect query={this.state.query}>
            {({ loading, error, data }) => {
                if (loading) {
                    return "Loading...";
                }
                if (error) {
                    Log.error("Error Loading query: " + JSON.stringify(error), "GraphQlBootstrapTable");
                    return `Error! ${error.message}`;
                }
                
                let items = [];
                let nextToken = null;
                if ((data) && (data.me)) {
                    items = data.me.user.tenants[0].tenant.users.items || [];
                    if (data.me.user.tenants[0].tenant.users.nextToken !== null) {
                        nextToken = data.me.user.tenants[0].tenant.users.nextToken;
                    }
                }
              
                return (
                    <div>
                         <Row>
                            <Col xs={12}>
                                <BootstrapTable 
                                    bootstrap4
                                    striped
                                    hover
                                    keyField='userId' 
                                    data={ items || [] } 
                                    columns={ this.tableConfig.columns } 
                                    bordered={false} 
                                    remote={ { pagination: false, filter: false, sort: false } }
                                    rowEvents={ this.rowEvents }
                                /> 
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={5} sm={5} xs={4}>
                                <Button color="primary"  disabled={this.state.page === 0} onClick={() => {
                                    this.setState({ 
                                        query: graphqlOperation(this.GET_QUERY, {tenant: this.props.tenant, limit, nextToken: prevToken[this.state.page-1]}),
                                        page: this.state.page-1
                                    });
                                }} >Prev</Button> 
                            </Col>
                            <Col lg={2} sm={2} xs={4}>
                                <Input type="select" name="limt" value={limit} onChange={(e) => {
                                    limit = e.target.value;
                                    this.setState({ 
                                        query: graphqlOperation(this.GET_QUERY, {tenant: this.props.tenant, limit, nextToken: prevToken[this.state.page]}),
                                    });
                                }}>
                                    <option>5</option>
                                    <option>10</option>
                                    <option>20</option>
                                    <option>50</option>
                                    <option>100</option>
                                </Input>
                            </Col>
                            <Col lg={5} sm={5} xs={4}>
                                <Button color="primary" className="float-right" disabled={nextToken == null} onClick={() => {
                                    prevToken[this.state.page+1] = nextToken;
                                    this.setState({
                                        page: this.state.page+1,
                                        query: graphqlOperation(this.GET_QUERY, {tenant: this.props.tenant, limit, nextToken}) 
                                    });
                                }} >Next</Button>
                            </Col>
                        </Row>
                    </div>
                    );
            }}
          </Connect>
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
