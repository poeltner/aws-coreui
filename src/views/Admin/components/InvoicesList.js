import React from "react"
import { Button, Row, Col } from "reactstrap";
import { Connect } from "aws-amplify-react";
import { graphqlOperation } from "aws-amplify";
import BootstrapTable from 'react-bootstrap-table-next';
// import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import {Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Log from "../../../utils/Logger/Log";
// import UsersEditModal from "../modals/users.edit.modal";

let limit = 10;

class InvoicesList extends React.Component{

    constructor(props) {
        super(props);

        this.GET_QUERY = this.props.query;

        Log.info("Tenant selected" + this.props.tenant, "GraphQlBootstrapTable");

        let qlprops = {}
        if (this.props.tenant != null)  { 
            qlprops = {tenant: this.props.tenant, limit};
        } else {
            qlprops ={limit};
        }

        this.state = {
            query: graphqlOperation(this.props.query, qlprops), 
            page: 0,
            filterTitle: ''
        }

        this.rowEvents.onClick =  this.rowEvents.onClick.bind(this);
        this.usersEditModal = React.createRef();
    }

    rowEvents = {
        onClick: (e, row) => {
            // this.setState({redirect: this.props.tableConfig.redirectUrl+row.id})
            this.usersEditModal.showModal(row.userId);
        }
    }; 

    render(){
        // let page = 0;
        let prevToken = [];


        if (this.state.redirect) {
            return (
                <Redirect to={this.state.redirect} />
            );
        }

        return (
        <div>
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
                // console.log("data " + JSON.stringify(data,2,2))
                if ((data) && (data.me)) {
                    items = data.me.user.tenants[0].tenant.invoices.items;
                    
                    // console.log("data1: " + JSON.stringify(items,2,2))
                    if (data.me.user.tenants[0].tenant.invoices.nextToken != null) {
                        // console.log("nextoken exists ")
                        nextToken = data[this.props.tableConfig.qlmethod].data.nextToken;
                    }
                }
              

                    return (
                    <div>
                         <Row>
                            <Col xs={12}>
                                <BootstrapTable 
                                    bootstrap4
                                    keyField='invoiceId' 
                                    classes='hover bordered striped responsive' 
                                    data={ items || [] } 
                                    columns={ this.props.tableConfig.columns } 
                                    bordered={false} 
                                    remote={ { pagination: false, filter: false, sort: false } }
                                    rowEvents={ this.rowEvents }
                                /> 
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Button color="primary"  disabled={this.state.page === 0} onClick={() => {
                                    this.setState({ 
                                        query: graphqlOperation(this.GET_QUERY, {tenant: this.props.tenant, limit, nextToken: prevToken[this.state.page-1]}),
                                        page: this.state.page-1
                                    });
                                }} >Prev</Button> 
                            </Col>
                            <Col xs={6}>
                                <Button color="primary" className="float-right" disabled={nextToken == null} onClick={() => {
                                    prevToken[this.state.page]= data[this.props.tableConfig.qlmethod].nextToken;
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

InvoicesList.propTypes = {
  query: PropTypes.string,
  tableConfig: PropTypes.any,
  tenant: PropTypes.string
}

export default InvoicesList;
