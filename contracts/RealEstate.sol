pragma solidity ^0.4.23;
import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";


contract RealEstate{

    using SafeMath for uint;

    // real estate 不動産
    struct Property{
        uint id;
        string title;
        uint price;
        address ownerAddress;//不動産のオーナー
        address ownerUportAddress;
        address rewardAddress;//不動産の利権をもらえる人
        uint leaseLimit; //貸付の期限。期限を超えたら権利を引き上げることができる
        uint leasePrice;
        mapping(uint => bool) isNotEmpty; //
        bool onSale; //利権が売りに出ているかどうか
    }

    //不動産の予約されている日付
    mapping(uint => uint[]) propertyIdToReservedDate;
    //利権を売りに出している不動産
    uint[] onSalePropertyIds;
    mapping(uint => uint) propertyIdToSaleIndex;

    enum Status{Pending, Approved, Declined}

    //予約に関する情報
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
        uint propertyId = properties.push(Property(properties.length, _title, _price, msg.sender, _uportAddress,
        msg.sender,now,0,false)).sub(1);
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
            if(property.isNotEmpty[_startDate.add(1)]){
               revert();
            }else{
                property.isNotEmpty[_startDate.add(1)] = true;
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

    //利権を持っているユーザーが資金を引き出す
    function withdrawCharge(uint _requestId) external{
        Request storage request = requests[_requestId];
        Property storage property = properties[request.propertyId];
        require(msg.sender == property.rewardAddress);
        if(request.checked || (request.now + 60 days) < now){
            property.rewardAddress.transfer(request.deposit);
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
    //利権を売りに出す
    function propertyOnSale(uint _propertyId, uint _expireDate, uint _price) external {
        require(_expireDate >= 7 days);
        Property storage property = properties[_propertyId];
        //利権もオーナーも自分である場合に売りに出すことができる
        require(property.ownerAddress == msg.sender && property.ownerAddress == property.rewardAddress);
        property.onSale = true;
        property.leasePrice = _price;
        property.leaseLimit = _expireDate;
        propertyIdToSaleIndex[_propertyId] = onSalePropertyIds.push(_propertyId).sub(1);
    }

    //利権をマーケットから撤退する
    function propertyNotOnSale(uint _propertyId) external{
        Property storage property = properties[_propertyId];
        require(msg.sender == property.ownerAddress);
        uint lastIndex = onSalePropertyIds.length.sub(1);
        uint lastProperty = onSalePropertyIds[lastIndex];
        onSalePropertyIds[propertyIdToSaleIndex[_propertyId]] = lastProperty;
        propertyIdToSaleIndex[lastProperty] = propertyIdToSaleIndex[_propertyId];
        propertyIdToSaleIndex[_propertyId] = 0;
        onSalePropertyIds.length--;
    }

    function removeOnSale(uint _propertyId) internal{
        Property storage property = properties[_propertyId];
        uint lastIndex = onSalePropertyIds.length.sub(1);
        uint lastProperty = onSalePropertyIds[lastIndex];
        onSalePropertyIds[propertyIdToSaleIndex[_propertyId]] = lastProperty;
        propertyIdToSaleIndex[lastProperty] = propertyIdToSaleIndex[_propertyId];
        propertyIdToSaleIndex[_propertyId] = 0;
        property.onSale = false;
        onSalePropertyIds.length--;
    }

    function getOnSalePropertyLength() external view returns(uint){
        return onSalePropertyIds.length;
    }

    function buyRewardAddress(uint _propertyId) external payable{
        Property storage property = properties[_propertyId];
        require(property.leasePrice <= msg.value && property.onSale);
        property.leaseLimit = now + property.leaseLimit;
        property.rewardAddress = msg.sender;
        removeOnSale(_propertyId);
    }

    function getOnSalePropertyIds() external view returns(uint[]) {
        return onSalePropertyIds;
    }

    function resumeRewardAddress(uint _propertyId) external {
        Property storage property = properties[_propertyId];
        require(property.ownerAddress == msg.sender && property.leaseLimit < now);
        property.rewardAddress = msg.sender;
    }
}