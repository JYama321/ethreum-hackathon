import React, { Component } from 'react'
import {userProperties, getProperty,userRequests,getRequests} from "../../util/eth-function";
const contract_address = "0x8065f4c7b8c2bf53561af92d9da2ea022a0b28ca";

class Dashboard extends Component {
    constructor(props, { authData }) {
        super(props)
        authData = this.props
        this.state={
            properties: [],
            requests: []
        }
    }

    async componentDidMount(){
        let properties = this.state.properties;
        let requests = this.state.requests;
        const self = this;
        userProperties().then(result => {
            console.log(result,'userProperty');
            for(var i=0;i<result.length;i++){
                getProperty(result[i].toNumber()).then(property => {
                    properties.push(property);
                    self.setState({
                        properties: properties
                    })
                })
            }
        });
        userRequests().then(result => {
            for(var j=0;j<result.length;j++){
                getRequests(result[j].toNumber()).then(request => {
                    console.log(request,'request');
                    requests.push(request)
                    self.setState({
                        requests: requests
                    })
                })
            }
        })
    }


    renderReservationPlace(){
        return this.state.requests.map((result,index) => {
            return (
                <div className="col-lg-6 portfolio-item">
                    <div className="card h-100">
                        <div className="card-body">
                            <h4 className="card-title">
                                <a href={"/house/"+result[1].toNumber()}>Status: {this.returnStatuss(result[0].toNumber())}</a>
                            </h4>
                        </div>
                    </div>
                </div>
            )
        })
    }
    returnStatuss(num){
        switch (num){
            case 0:
                return 'Pending';
            case 1:
                return 'Accepted';
            case 2:
                return 'Declined';

        }
    }

    renderHostHorses(){
        return this.state.properties.map((result,index) => {
            return (
                <div className="col-lg-4 portfolio-item" key={index+'horse'}>
                    <div className="card h-100">
                        <a href="#"><img className="card-img-top" src={"images/house"+(result[0].toNumber()+1)+".png"} alt=""/></a>
                        <div className="card-body">
                            <h4 className="card-title">
                                <a href={"/houses/" + result[0].toNumber()}>{result[1]}</a>
                            </h4>
                            <p className="houseprice">
                                <sp className="houseprice">{window.web3.fromWei(result[2],"szabo").toFixed(3)} szabo</sp>
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
                <h1 className="my-4">Reservation places
                </h1>
                <div className="row">
                    <div className="col-lg-6 portfolio-item">
                        {this.renderReservationPlace()}
                    </div>
                </div>
                <h1 className="my-4">Host horses</h1>
                <div className="row">
                    <div className="row">
                        {this.renderHostHorses()}
                    </div>
                </div>
            </main>
        )
    }
}

export default Dashboard
