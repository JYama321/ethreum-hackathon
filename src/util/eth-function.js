
export const addProperty = (title, price, uPortAddress) => {
    return new Promise((resolve, reject) => {
        window.contract_instance.addProperty(title,window.web3.toWei(price,"ether"),uPortAddress,
            {from: window.web3.eth.coinbase},function(err, result){
                if(err){reject(err)}
                resolve(result)
            })
    })
};


export const applyRent = (startDate, stayLength, propertyId, value) => {
    return new Promise((resolve, reject) => {
        window.contract_instance.applyRent(startDate, stayLength,propertyId,
            {from: window.web3.eth.coinbase,value: window.web3.toWei(value,"ether")}
            ,function(err, result){
                if(err){reject(err)}
                resolve(result)
            })
    })
};


export const confirmApplication = (requestId,isAccept) => {
    return new Promise((resolve, reject) => {
        window.contract_instance.confirmApplication(requestId,isAccept,
            {from: window.web3.eth.coinbase},function (err, result) {
                if(err){reject(err)}
                resolve(result)
            })
    })
};


export const refunds = (requestId) => {
    return new Promise((resolve, reject) => {
        window.contract_instance.refunds(requestId,{from: window.web3.eth.coinbase},function(err, result) {
            if(err){reject(err)}
            resolve(result)
        })
    })
};


export const checkRequest = (requestId) => {
    return new Promise((resolve, reject) => {
        window.contract_instance.checkRequest(requestId,
            {from: window.web3.eth.coinbase},function (err, result) {
                if(err){reject(err)}
                resolve(result)
            })
    })
};

export const withdrawCharge = (requestId) => {
    return new Promise((resolve ,reject) => {
        window.contract_instance.withdrawCharge(requestId,{from: window.web3.eth.coinbase},function (err, result) {
            if(err){reject(err)}
            resolve(result)
        })
    })
};

export const userProperties = () => {
    return new Promise((resolve ,reject) => {
        window.contract_instance.userProperties({from: window.web3.eth.coinbase},function (err, result) {
            if(err){reject(err)}
            resolve(result)
        })
    })
};

export const userRequests = () => {
    return new Promise((resolve ,reject) => {
        window.contract_instance.userRequest({from: window.web3.eth.coinbase},function(err, result){
            if(err){reject(err)}
            console.log('userRequests',result);
            resolve(result)
        })
    })
};

export const propertyLength = () => {
    return new Promise((resolve, reject) => {
        window.contract_instance.propertyLength({from: window.web3.eth.coinbase},function (err, result) {
            if(err){reject(err)}
            resolve(result)
        })
    })
};

export const requestsLength = () => {
    return new Promise((resolve ,reject) => {
        window.contract_instance.requestsLength({from: window.web3.eth.coinbase},function(err, result) {
            if(err){reject(err)}
            resolve(result)
        })
    })
};

export const getProperty = (propertyId) => {
    return new Promise((resolve, reject) => {
            window.contract_instance.properties(propertyId,function(err, result) {
                if(err){reject(err)}
                resolve(result)
            })
        }
    )};

export const getRequests = (requestId) => {
    return new Promise((resolve, reject) => {
        window.contract_instance.requests(requestId,function(err, result){
            if(err){reject(err)}
            resolve(result)
        })
    })
};

export const getOnSalePropertyLength = () => {
    return new Promise((resolve, reject) => {
        window.contract_instance.getOnSalePropertyLength({from: window.web3.eth.coinbase},function (err, result) {
            if(err){reject(err)}
            resolve(result)
        })
    })
};

export const getOnSalePropertyIds = () => {
    return new Promise((resolve, reject) => {
        console.log(window.contract_instance);
        window.contract_instance.getOnSalePropertyIds(function (err, result) {
            if(err){reject(err)}
            console.log('on sale property id', result)
            resolve(result)
        })
    })
};