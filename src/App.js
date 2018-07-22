import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'
import RealEstate from '../build/contracts/RealEstate.json'
// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'
import getWeb3 from './util/getWeb3'
import {
    addProperty,
    propertyLength,
    userProperties,
    getProperty,
    getRequests
} from "./util/eth-function";
// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
const contract_address = "0x8065f4c7b8c2bf53561af92d9da2ea022a0b28ca";
class App extends Component {
    constructor(props){
        super(props);
        this.state={
            properties: []
        }
    }
    async componentWillMount(){
        const result = await getWeb3();
        const self = this;
        window.web3 = result.web3;
        const contract = window.web3.eth.contract(RealEstate.abi);
        window.contract_instance = contract.at(contract_address);
        propertyLength().then(result => {
            for(var i=0;i<result.toNumber()-1;i++){
                getProperty(i).then(property => {
                    self.setState({
                        properties: self.state.properties.concat(property)
                    })
                })
            }
        })
    }
    render() {
        const OnlyAuthLinks = VisibleOnlyAuth(() =>
                <span>
        <li className="pure-menu-item" style={{marginTop: '5px'}}>
          <Link to="/dashborad" className="pure-menu-link">MyPage</Link>
        </li>

        <LogoutButtonContainer />
      </span>
        );

        const OnlyGuestLinks = HiddenOnlyAuth(() =>
                <span>
        <LoginButtonContainer />
      </span>
        );

        return (
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                    <Link to="/" className="pure-menu-heading pure-menu-link">Air bnb</Link>
                    <Link to="/market" className="pure-menu-heading pure-menu-link">Market</Link>
                    <ul className="navbar-nav ml-auto" style={{width: '400px',position: 'absolute', right: 0}}>
                        <OnlyGuestLinks />
                        <OnlyAuthLinks />
                    </ul>
                </nav>

                {this.props.children}
            </div>
        );
    }
}

export default App
