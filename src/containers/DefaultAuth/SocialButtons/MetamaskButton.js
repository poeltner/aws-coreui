import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Web3 from 'web3';
import { Auth } from 'aws-amplify';

export default function withMetamask(Comp) {
    return class extends Component {
        constructor(props) {
            super(props);

            
            this.initMM = this.initMM.bind(this);
            this.signIn = this.signIn.bind(this);
            this.federatedSignIn = this.federatedSignIn.bind(this);
            this.fetchNonce = this.fetchNonce.bind(this);

            this.state = {};
        }

        signIn() {
            const web3 = window.web3;

            web3.eth.getAccounts((error, accounts) => {
                if (accounts.length == 0) {
                    // there is no active accounts in MetaMask
                    console.log("no active accoutn")
                }
                else {
                    // It's ok
                    console.log("ok " + JSON.stringify(accounts))
                 
                    web3.personal.sign(
                        web3.fromUtf8(`I am signing my one-time nonce: ` + this.state.nonce),
                        accounts[0],
                        (err, signature) => {
                          if (err) return console.log("err " + err);
                          fetch(this.props.serverUrl+"/authorization?publicAddress=" + accounts[0] +"&response_type=id_token&signature="+signature)
                            .then(response => {
                                return response.json();
                            })
                            .then(data => {
                                console.log("data " + JSON.stringify(data));
                                this.federatedSignIn(data);
                            })
                        }
                      )
                }
            });
        }
        
        federatedSignIn(response) {
            // logger.debug(response);
            const { onStateChange } = this.props;

            const { id_token, expires_at } = response;

            if (!id_token) {
                return;
            }

            fetch(this.props.serverUrl+"/userinfo")
                .then(restuls => {
                    return restuls.json()
                })
                .then(data => {
                    console.log("data" + JSON.stringify(data));
                    const user = {
                        name: data.name,
                        email: data.email
                    };
                    console.log("user"+ JSON.stringify(user));
                    if (!Auth || 
                        typeof Auth.federatedSignIn !== 'function' || 
                        typeof Auth.currentAuthenticatedUser !== 'function') {
                        throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
                    }
                    Auth.federatedSignIn('maee5s4oh8.execute-api.eu-central-1.amazonaws.com/dev', { token: id_token, expires_at }, user)
                    .then(credentials => {
                        return Auth.currentAuthenticatedUser();
                    }).then(authUser => {
                        if (onStateChange) {
                            onStateChange('signedIn', authUser);
                        }
                    });
                })
        }



        componentDidMount() {
            this.initMM();
            this.fetchNonce();
        }

        initMM() {
            if (typeof web3 !== 'undefined') {        
                let web3 = new Web3(window.web3.currentProvider)
                if (web3.currentProvider.isMetaMask === true) {
                    web3.eth.getAccounts((error, accounts) => {
                        if (accounts.length == 0) {
                            // there is no active accounts in MetaMask
                            console.log("no active account")
                        }
                        else {
                            // It's ok
                            console.log("ok " + JSON.stringify(accounts))
                            this.setState({ isMetaMask: true })
                        }
                    });
                } else {
                    // Another web3 provider
                }
            } else {
                // No web 3 provider
            }    
        }

        fetchNonce() {
            const web3 = window.web3;

            web3.eth.getAccounts((error, accounts) => {
                if (accounts.length == 0) {
                    // there is no active accounts in MetaMask
                    console.log("no active accoutn")
                }
                else {
                    // It's ok
                    const url = this.props.serverUrl+"/authorization?publicAddress=" + accounts[0] +"&response_type=nonce";
                    fetch(url)
                        .then(results => {
                            return results.json();
                        })
                        .then(data =>  {
                            console.log("nonce" + data.nonce);
                            this.setState({ nonce: data.nonce })
                        })

                }
            });
            
        }

        // handleSignMessage = ({ publicAddress, nonce }) => {
        //     const web3 = window.web3;
        //     return new Promise((resolve, reject) =>
        //       web3.personal.sign(
        //         web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        //         publicAddress,
        //         (err, signature) => {
        //           if (err) return reject(err);
        //           return resolve({ publicAddress, signature });
        //         }
        //       )
        //     );
        //   };

        render() {
            // if (!this.state.isMetaMask) return;
            return (
                <Comp {...this.props} metamaskSignIn={this.signIn}/>
            );
        }
    };
}

const CustomButton = (props) => (
    <Button
        className="btn"
        onClick={props.metamaskSignIn}
        block
    >
        Sign In with MetaMask
    </Button>
);

export const MetamaskButton = withMetamask(CustomButton);