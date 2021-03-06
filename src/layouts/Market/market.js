import React, { Component } from 'react'
import {getOnSalePropertyIds, getProperty} from "../../util/eth-function";
import getWeb3 from "../../util/getWeb3";
import RealEstate from '../../../build/contracts/RealEstate.json'
const contract_address = "0x8065f4c7b8c2bf53561af92d9da2ea022a0b28ca"

class Market extends Component {
    constructor(props){
        super(props);
        this.state={
            properties: []
        }
    }

    async componentDidMount(){
        const result = await getWeb3();
        const self = this;
        const property = this.state.properties;
        window.web3 = result.web3;
        const contract = window.web3.eth.contract(RealEstate.abi);
        window.contract_instance = contract.at(contract_address);
        getOnSalePropertyIds().then(result => {
            for(var i=0;i<result.length;i++){
                getProperty(result[i].toNumber()).then(data => {
                    property.push(data);
                    self.setState({
                        properties: property
                    })
                })
            }
        })
    }

    renderProperties(){
        return this.state.properties.map((result,index) => {
            return (
                <div className="col-lg-4 col-sm-6 portfolio-item" key={index+'horse'}>
                    <div className="card h-100">
                        <a href="#"><img className="card-img-top" src={"images/house"+(result[0].toNumber()+1)+".png"} alt=""/></a>
                        <div className="card-body">
                            <h4 className="card-title">
                                <a href={"/houses/" + result[0].toNumber()}>{result[1]}</a>
                            </h4>
                            <p className="houseprice">
                                <sp className="houseprice">{window.web3.fromWei(result[7],"ether").toFixed(2)} ETH</sp>
                            </p>
                            <p className="houseprice">
                                <sp className="houseprice">Duration {Math.ceil(result[6] / (60*60*24))} days</sp>
                            </p>
                        </div>
                    </div>
                </div>
            )
        })
    }

    render() {
        return(
            <main className="container">
                <h1 className="my-4">You can buy rights to receive rewards.
                </h1>
                <div className="row">
                    {this.renderProperties()}
                </div>
            </main>
        )
    }
}

export default Market
