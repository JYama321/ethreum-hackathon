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
const contract_address = "0x345ca3e014aaf5dca488057592ee47305d9b3e10"

class App extends Component {
    async componentWillMount(){
        const result = await getWeb3();
        window.web3 = result.web3;
        const contract = window.web3.eth.contract(RealEstate.abi);
        window.contract_instance = contract.at(contract_address);
        propertyLength().then(result => {
            console.log(result)
        })

    }
    render() {
        const OnlyAuthLinks = VisibleOnlyAuth(() =>
                <span>
        <li className="pure-menu-item">
          <Link to="/my-page" className="pure-menu-link">MyPage</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
          <li>
              <Link to="/">Become a host</Link>
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
                    <ul className="navbar-nav ml-auto">
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
