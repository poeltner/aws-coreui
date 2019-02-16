import React from "react"
import { Row, Col, Table, Button } from "reactstrap";
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from 'prop-types';
import Log from "../../../utils/Logger/Log";
import { withNamespaces } from "react-i18next";

class OrdersList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            items: [],
           tenant: this.props.tenant,
       }

       this.loadData = this.loadData.bind(this);
       this.resetList = this.resetList.bind(this);    
    }

    componentDidMount() {
        this.loadData();
    }

    async resetList() {
        this.loadData();
    }

    async loadData () {
        this.setState({isLoading: true});

    
        const selfData = await API.graphql(graphqlOperation(MeData, { tenant: this.state.tenant}));
        Log.debug(`Self Data : ${JSON.stringify(selfData)}`, 'OrdersList');
        if ((selfData.data.me.user.tenants !== null) 
          && (selfData.data.me.user.tenants[0].tenantId === this.state.tenant)) {
            const items = selfData.data.me.user.tenants[0].tenant.orders || [];
            items.sort(this.compareNumbers);
            Log.debug(`items ${JSON.stringify(items)}`, 'Admin.OrderList');
            this.setState({
                items,
            })
        }
        this.setState({isLoading: false});
        // Log.info('Self loaded ' + JSON.stringify(this.state), 'Admin.TeamList');
    }

    compareNumbers(a, b) {
        return b-a;
    }

    render(){
        const {t} = this.props;

        return (
        <div>
            <div>
                <Row>
                    <Col xs={12}>
                        <Table responsive striped hover>
                            <thead>
                            <tr>
                                <th>Order</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                                { this.state.items.map((row) => (
                                    <tr key={row.orderId}>
                                        <td>
                                            { row.subscriptionName } ({ row.subscriptionPeriod } )<br/>
                                            Abrechnungsdatum: {t('date', { date: new Date(parseInt(row.currentPeriod)) }) || ''} <br/>
                                            Erstellungsdatum der Bestellung: {t('date', { date: new Date(parseInt(row.orderDate)) }) || ''}<br/>
                                            Bestellnummer: {row.orderId} 
                                        </td>
                                        <td>
                                            <h4 className="float-center">€ {row.priceFirstMonth || 0.00}</h4>
                                            <Button color="link" className="float-center">Rechnung anzeigen(PDF)</Button><br/>
                                            {row.invoiceId || ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div> 
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

const MeData = `query Me($tenant: String) {
    me {
        userId
        user {
          id
  
          tenants(tenant: $tenant) {
            tenantId
            tenant {
              id

              invoices {
                items {
                  invoiceId
                  totalPrice
                }
              }
  
              orders {
                orderId
                orderDate
                orderStatus
                totalPrice
                invoiceId
                subscriptionName
                subscriptionPeriod
                currentPeriod
                priceFirstMonth
              }
              
            }
          }
        }
    }
  }`;