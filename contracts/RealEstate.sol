pragma solidity ^0.4.23;
import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";


contract RealEstate{

    using SafeMath for uint;

    // real estate property
    struct Property{
        uint id;
        string title;
        uint price;
        address ownerAddress;
        address ownerUportAddress;
        mapping(uint => bool) isNotEmpty;
    }

    mapping(uint => uint[]) propertyIdToReservedDate;

    enum Status{Pending, Approved, Declined}

    struct Request{
        Status status;
        uint propertyId;
        address applicant;
        uint requestId;
        uint date;
        uint stayLength;
        uint deposit;
        uint now;
        bool checked;
    }

    struct User{
        uint[] properties;
        uint[] requests;
    }

    mapping(address => User) userInfo;
    Property[] public properties;
    Request[] public requests;

    event ApplyRent(address indexed _from, uint _propertyId, uint _date, uint _dateLength, uint _requestId);
    event AddProperty(address indexed _from, uint _propertyId, string _title);
    event Confirmation(address indexed _applicant, address indexed _owner, bool _result);

    //add user property
    function addProperty(string _title, uint _price, address _uportAddress) external {
        uint propertyId = properties.push(Property(properties.length, _title, _price, msg.sender, _uportAddress)).sub(1);
        User storage user = userInfo[msg.sender];
        user.properties.push(propertyId);
        emit AddProperty(msg.sender, propertyId, _title);
    }

    //first apply
    function applyRent(uint _startDate, uint _stayLength, uint _propertyId) external payable{
        Property storage property = properties[_propertyId];
        User storage user = userInfo[msg.sender];
        require(_stayLength <= 5);
        require(msg.value >= property.price * _stayLength);
        for(uint i=0;i<_stayLength;i++){
            if(property.isNotEmpty[_startDate]){
               revert();
            }else{
                property.isNotEmpty[_startDate] = true;
            }
        }
        uint requestId = requests.push(Request(
                Status.Pending,_propertyId,msg.sender,requests.length,_startDate,_stayLength,msg.value,now,false)
        ).sub(1);
        user.requests.push(requestId);
        emit ApplyRent(msg.sender,_propertyId, _startDate, _stayLength,requestId);
    }

    //confirm application
    function confirmApplication(uint _requestId, bool _isAccept) external {
        Request storage request = requests[_requestId];
        Property storage property = properties[request.propertyId];
        require(property.ownerAddress == msg.sender && request.status == Status.Pending);
        if(_isAccept){
            request.status = Status.Approved;
            for(uint i=0;i<request.stayLength ;i++){
                propertyIdToReservedDate[request.propertyId].push(request.date.add(i));
            }
        }else{
            request.status = Status.Declined;
            for(uint j=0;j<request.stayLength;j++){
                property.isNotEmpty[request.date.add(j)] = false;
            }

        }
        emit Confirmation(request.applicant,msg.sender,_isAccept);
    }

    function refunds(uint _requestId) external{
        Request storage request = requests[_requestId];
        require((request.now + 3 days < now && request.status == Status.Pending) || request.status == Status.Declined);
        uint deposit = request.deposit;
        request.deposit = 0;
        msg.sender.transfer(deposit);
    }

    function checkRequest(uint _requestId) external{
        Request storage request = requests[_requestId];
        require(msg.sender == request.applicant && request.status == Status.Approved);
        request.checked=true;
    }

    function withdrawCharge(uint _requestId) external{
        Request storage request = requests[_requestId];
        if(request.checked || (request.now + 60 days) < now){
            msg.sender.transfer(request.deposit);
        }
    }

    function userProperties() external view returns(uint[]){
        return userInfo[msg.sender].properties;
    }

    function userRequest() external view returns(uint[]){
        return userInfo[msg.sender].requests;
    }

    function propertyLength() external view returns(uint) {
        return properties.length;
    }

    function requestsLength() external view returns(uint){
        return requests.length;
    }
}