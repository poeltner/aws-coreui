import React from "react"
import { Button, Row, Col } from "reactstrap";
import { Connect } from "aws-amplify-react";
import { graphqlOperation } from "aws-amplify";
import BootstrapTable from 'react-bootstrap-table-next';
import {Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Log from "../../utils/Logger/Log";

let limit = 10;

class GraphQlBootstrapTable extends React.Component{

    constructor(props) {
        super(props);
        this.state={}
        
        this.GET_QUERY = this.props.query;
        this.rowEvents.onClick =  this.rowEvents.onClick.bind(this);

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
    }

    rowEvents = {
        onClick: (e, row) => {
            this.setState({redirect: this.props.tableConfig.redirectUrl+row.id})
           
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
            {/* Search: <Input onChange={(event) => {
                            
                            let value = event.target.value;
                            clearTimeout(timeout);
                            timeout = setTimeout(() => {
                                if (value.length > 0) {
                                    let filter = {}
                                    filter[this.props.tableConfig.filterElement] = {
                                        contains: value
                                    }
                                    this.setState({        
                                        filter,                               
                                        query: graphqlOperation(this.props.query, {limit, filter}), 
                                        page:0
                                    })
                                } else {
                                    this.setState({
                                        filter: null,
                                        query: graphqlOperation(this.props.query, {limit}),
                                        page: 0
                                    })
                                }
                                
                                prevToken=[];
                            }, 1000);
                        }} />  */}
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
                if ((data) && (data[this.props.tableConfig.qlmethod])) {
                    items = data[this.props.tableConfig.qlmethod].data.items;
                    
                    // console.log("data: " + JSON.stringify(data[this.props.tableConfig.qlmethod],2,2))
                    if (data[this.props.tableConfig.qlmethod].data.nextToken != null) {
                        // console.log("nextoken exists ")
                        nextToken = data[this.props.tableConfig.qlmethod].data.nextToken;
                    }
                }

                    return (
                    <div>
                         <Row>
                            <Col xs={12}>
                                <BootstrapTable keyField='id' classes='hover bordered striped responsive' rowEvents={ this.rowEvents } data={ items || [] } columns={ this.props.tableConfig.columns } bordered={false} remote={ { pagination: false, filter: false, sort: false } }  /> 
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

GraphQlBootstrapTable.propTypes = {
  query: PropTypes.string,
  tableConfig: PropTypes.any,
  tenant: PropTypes.string
}

export default GraphQlBootstrapTable;
