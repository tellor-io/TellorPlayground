pragma solidity 0.7.0;


//Slightly modified SafeMath library - includes a min and max function, removes useless div function
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }

    function add(int256 a, int256 b) internal pure returns (int256 c) {
        if (b > 0) {
            c = a + b;
            assert(c >= a);
        } else {
            c = a + b;
            assert(c <= a);
        }
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    function max(int256 a, int256 b) internal pure returns (uint256) {
        return a > b ? uint256(a) : uint256(b);
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function sub(int256 a, int256 b) internal pure returns (int256 c) {
        if (b > 0) {
            c = a - b;
            assert(c <= a);
        } else {
            c = a - b;
            assert(c >= a);
        }

    }
}

contract Tellor {

    using SafeMath for uint256;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);//ERC20 Transfer Event
    
    mapping(uint256 => mapping(uint256 => uint256)) public values; //requestId -> timestamp -> value
    mapping(uint256 => mapping(uint256 => bool)) public isDisputed; //requestId -> timestamp -> value
    mapping(uint256 => uint256[]) public timestamps;
    mapping(address => uint) public balances;
    uint256 public totalSupply;


    uint[] public idQ;
    mapping(uint => uint) public valueQ;
    mapping(uint => uint) public tipQ;

    constructor(address[] memory _initialBalances, uint256[] memory _intialAmounts) public {
        require(_initialBalances.length == _intialAmounts.length, "Arrays have different lengths");
        for(uint i = 0; i < _intialAmounts.length; i++){
            balances[_initialBalances[i]] = _intialAmounts[i];
            totalSupply = totalSupply.add(_intialAmounts[i]);
        }
    }

    function mint(address _holder, uint256 _value) public {
        balances[_holder] = balances[_holder].add(_value);
        totalSupply = totalSupply.add(_value);
    }

    function transfer(address _to, uint256 _amount) public returns(bool) {
        return transferFrom(msg.sender, _to, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns(bool){
        require(_amount != 0, "Tried to send non-positive amount");
        require(_to != address(0), "Receiver is 0 address");
        balances[_from] = balances[_from].sub(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Transfer(_from, _to, _amount);
    }

    // function submitValue(uint256 _requestId,uint256 _value) external {
    //     _submitValue(_requestId, _value);
    // }


    function disputeValue(uint256 _requestId, uint256 _timestamp) external {
        values[_requestId][_timestamp] = 0;
        isDisputed[_requestId][_timestamp] = true;
    }

    function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(uint256){
        return values[_requestId][_timestamp];
    }

    function isInDispute(uint256 _requestId, uint256 _timestamp) public view returns(bool){
        return isDisputed[_requestId][_timestamp];
    }

    function getNewValueCountbyRequestId(uint256 _requestId) public view returns(uint) {
        return timestamps[_requestId].length;
    }

    function getTimestampbyRequestIDandIndex(uint256 _requestId, uint256 index) public view returns(uint256) {
        uint len = timestamps[_requestId].length;
        if(len == 0 || len <= index) return 0; 
        return timestamps[_requestId][index];
    }


    function newBlock(uint[5] calldata _requestIds, uint[5] calldata _values) external {
        uint qLength =idQ.length ;
        
        uint[5] memory ids;
        //check queue
        if (qLength > 5) {
            ids = getTop5();

            //remove ids from queue
        } else if (qLength <= 5) {
            //get all from the q
        }

            
        //choose top payers

        //fill the rest, if any, with ids from the rinkeby miner

    }



    function _submitValue(uint256 _requestId,uint256 _value) internal {
        values[_requestId][block.timestamp] = _value;
        timestamps[_requestId].push(block.timestamp);
    }


    function getTop5() internal view returns (uint256[5] memory ids) {
        ids = [uint256(0),0,0,0,0]; 
        uint256 minTip; 
        uint256 minIdx;

        for(uint256 j=0;j<5;j++){
            ids[j] == (idQ[j]);
        }

        //Too many tips tp sort, just take first 5
        if(idQ.length > 50) {
            return ids;
        }

        (minTip, minIdx) = getMin(ids);
        for(uint256 i = 6; i < ids.length; i++) {
            if (tipQ[idQ[i]] > minTip) {
                ids[minIdx] = idQ[i];
                (minTip, minIdx) = getMin(ids);
            }
        }
    }

    function getMin(uint[5] memory ids) internal view returns(uint minTip, uint minIdx) {
        minTip = tipQ[ids[0]]; 
        minIdx = 0;
          for(uint256 j=0;j<5;j++){
            if(tipQ[idQ[j]] < minTip){
                minTip = tipQ[idQ[j]];
                minIdx = j;
            }
        }
    }
}