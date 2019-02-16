import React from "react"
import { Row, Col } from "reactstrap";
import { Connect } from "aws-amplify-react";
import { graphqlOperation } from "aws-amplify";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Log from "../../../utils/Logger/Log";
import { withNamespaces } from "react-i18next";
// import UsersEditModal from "../modals/users.edit.modal";

let limit = 10;

class OrdersList extends React.Component{

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
    }

    t(content) {
        return this.props.t(content);
    }

    tableConfig = {
        columns: [
            {
                dataField: 'orderDate',
                text: this.props.t('Date'),
                // headerClasses: 'text-primary',
                headerStyle: () => {
                    return { width: '15%', textAlign: 'left' };
                },
                formatter: (cell) => {
                    return this.props.t('date', { date: new Date(parseInt(cell)) })
                },
                style: { textAlign: 'left' },
            },
            {
                dataField: 'orderId',
                text: this.props.t('Order ID'),
                // headerClasses: 'text-primary',
                headerStyle: () => {
                    return { width: '25%', textAlign: 'left' };
                }
            },
            {
                dataField: 'totalPrice',
                text: this.props.t('Amount'),
                // headerClasses: 'text-primary',
                headerStyle: () => {
                    return { width: '25%', textAlign: 'center' };
                },
                style: { textAlign: 'center' },
                formatter: (cell) => {
                    return `EUR ${cell.toFixed(2)}`
                },
            },
            {
                dataField: 'orderStatus',
                text: this.props.t('Status'),
                // headerClasses: 'text-primary',
                headerStyle: () => {
                    return { width: '25%', textAlign: 'center' };
                },
                style: { textAlign: 'center' },
            },
            {
                dataField: 'invoiceId',
                text: this.props.t('Invoice'),
                headerStyle: () => {
                    return { width: '25%', textAlign: 'right' };
                },
                style: { textAlign: 'right' },
            }

          
    
        ]
    }

    rowEvents = {
        onClick: (e, row) => {
            // this.setState({redirect: this.props.tableConfig.redirectUrl+row.id})
            // this.usersEditModal.showModal(row.userId);
        }
    }; 

    render(){
        if (this.state.redirect) {
            return (
                <Redirect to={this.state.redirect} />
            );
        }

        const options = {
            
        };

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
                if ((data) && (data.me)) {
                    items = data.me.user.tenants[0].tenant.orders;
                }

                return (
                    <div>
                         <Row>
                            <Col xs={12}>
                                <div className="table-responsive">
                                <BootstrapTable 
                                    bootstrap4
                                    responsive
                                    bordered={false}
                                    striped
                                    keyField='orderId' 
                                    
                              
                                    data={ items || [] } 
                                    columns={ this.tableConfig.columns } 
                                    remote={ { pagination: false, filter: false, sort: false } }
                                    rowEvents={ this.rowEvents }
                                    pagination={ paginationFactory(options) }
                                /> 
                                </div>
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

OrdersList.propTypes = {
  query: PropTypes.string,
  tableConfig: PropTypes.any,
  tenant: PropTypes.string,
  t: PropTypes.any
}

export default withNamespaces('view_admin') (OrdersList);
