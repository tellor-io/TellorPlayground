// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract TellorPlayground {
    // Events
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event NewReport(
        bytes32 _queryId,
        uint256 _time,
        bytes _value,
        uint256 _nonce,
        bytes _queryData,
        address _reporter
    );
    event TipAdded(
        address indexed _user,
        bytes32 indexed _queryId,
        uint256 _tip,
        uint256 _totalTip,
        bytes _queryData
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    // Storage
    mapping(bytes32 => mapping(uint256 => bytes)) public values; //queryId -> timestamp -> value
    mapping(bytes32 => mapping(uint256 => bool)) public isDisputed; //queryId -> timestamp -> value
    mapping(bytes32 => uint256[]) public timestamps;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    // Functions
    /**
     * @dev Initializes playground parameters
     */
    constructor() {
        _name = "TellorPlayground";
        _symbol = "TRBP";
        _decimals = 18;
    }

    /**
     * @dev Approves amount that an address is alowed to spend of behalf of another
     * @param _spender The address which is allowed to spend the tokens
     * @param _amount The amount that msg.sender is allowing spender to use
     * @return bool Whether the transaction succeeded
     *
     */
    function approve(address _spender, uint256 _amount)
        public
        virtual
        returns (bool)
    {
        _approve(msg.sender, _spender, _amount);
        return true;
    }

    /**
     * @dev A mock function to create a dispute
     * @param _queryId The tellorId to be disputed
     * @param _timestamp the timestamp of the value to be disputed
     */
    function beginDispute(bytes32 _queryId, uint256 _timestamp) external {
        values[_queryId][_timestamp] = bytes("");
        isDisputed[_queryId][_timestamp] = true;
    }

    /**
     * @dev Public function to mint tokens to the given address
     * @param _user The address which will receive the tokens
     */
    function faucet(address _user) external {
        _mint(_user, 1000 ether);
    }

    /**
     * @dev A mock function to submit a value to be read without reporter staking needed
     * @param _queryId the ID to associate the value to
     * @param _value the value for the queryId
     * @param _nonce the current value count for the query id
     * @param _queryData the data used by reporters to fulfill the data query
     */
    function submitValue(
        bytes32 _queryId,
        bytes calldata _value,
        uint256 _nonce,
        bytes memory _queryData
    ) external {
        require(
            _nonce == timestamps[_queryId].length,
            "nonce should be correct"
        );
        require(
            _queryId == keccak256(_queryData) || uint256(_queryId) <= 100,
            "id must be hash of bytes data"
        );
        values[_queryId][block.timestamp] = _value;
        timestamps[_queryId].push(block.timestamp);
        emit NewReport(
            _queryId,
            block.timestamp,
            _value,
            _nonce,
            _queryData,
            msg.sender
        );
    }

    /**
     * @dev Adds a tip to a given query ID.
     * @param _queryId is the queryId to look up
     * @param _amount is the amount of tips
     * @param _queryData is the extra bytes data needed to fulfill the request
     */
    function tipQuery(
        bytes32 _queryId,
        uint256 _amount,
        bytes memory _queryData
    ) external {
        require(
            _queryId == keccak256(_queryData) || uint256(_queryId) <= 100,
            "id must be hash of bytes data"
        );
        _transfer(msg.sender, address(this), _amount);
        emit TipAdded(msg.sender, _queryId, _amount, _amount, _queryData);
    }

    /**
     * @dev Transfer tokens from one user to another
     * @param _recipient The destination address
     * @param _amount The amount of tokens, including decimals, to transfer
     * @return bool If the transfer succeeded
     */
    function transfer(address _recipient, uint256 _amount)
        public
        virtual
        returns (bool)
    {
        _transfer(msg.sender, _recipient, _amount);
        return true;
    }

    /**
     * @dev Transfer tokens from user to another
     * @param _sender The address which owns the tokens
     * @param _recipient The destination address
     * @param _amount The quantity of tokens to transfer
     * @return bool Whether the transfer succeeded
     */
    function transferFrom(
        address _sender,
        address _recipient,
        uint256 _amount
    ) public virtual returns (bool) {
        _transfer(_sender, _recipient, _amount);
        _approve(
            _sender,
            msg.sender,
            _allowances[_sender][msg.sender] - _amount
        );
        return true;
    }

    // Getters
    /**
     * @dev Returns the amount that an address is alowed to spend of behalf of another
     * @param _owner The address which owns the tokens
     * @param _spender The address that will use the tokens
     * @return uint256 The amount of allowed tokens
     */
    function allowance(address _owner, address _spender)
        public
        view
        virtual
        returns (uint256)
    {
        return _allowances[_owner][_spender];
    }

    /**
     * @dev Returns the balance of a given user.
     * @param _account user address
     * @return uint256 user's token balance
     */
    function balanceOf(address _account) public view returns (uint256) {
        return _balances[_account];
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * @return uint8 the number of decimals; used only for display purposes
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Counts the number of values that have been submitted for a given ID
     * @param _queryId the ID to look up
     * @return uint256 count of the number of values received for the queryId
     */
    function getNewValueCountbyQueryId(bytes32 _queryId)
        public
        view
        returns (uint256)
    {
        return timestamps[_queryId].length;
    }

    /**
     * @dev Gets the timestamp for the value based on their index
     * @param _queryId is the queryId to look up
     * @param _index is the value index to look up
     * @return uint256 timestamp
     */
    function getTimestampbyQueryIdandIndex(bytes32 _queryId, uint256 _index)
        public
        view
        returns (uint256)
    {
        uint256 len = timestamps[_queryId].length;
        if (len == 0 || len <= _index) return 0;
        return timestamps[_queryId][_index];
    }

    /**
     * @dev Returns the name of the token.
     * @return string name of the token
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Retrieves value from oracle based on queryId/timestamp
     * @param _queryId being requested
     * @param _timestamp to retrieve data/value from
     * @return bytes value for queryId/timestamp submitted
     */
    function retrieveData(bytes32 _queryId, uint256 _timestamp)
        public
        view
        returns (bytes memory)
    {
        return values[_queryId][_timestamp];
    }

    /**
     * @dev Returns the symbol of the token.
     * @return string symbol of the token
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the total supply of the token.
     * @return uint256 total supply of token
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // Internal functions
    /**
     * @dev Internal function to approve tokens for the user
     * @param _owner The owner of the tokens
     * @param _spender The address which is allowed to spend the tokens
     * @param _amount The amount that msg.sender is allowing spender to use
     */
    function _approve(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal virtual {
        require(_owner != address(0), "ERC20: approve from the zero address");
        require(_spender != address(0), "ERC20: approve to the zero address");
        _allowances[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }

    /**
     * @dev Internal function to burn tokens for the user
     * @param _account The address whose tokens to burn
     * @param _amount The quantity of tokens to burn
     */
    function _burn(address _account, uint256 _amount) internal virtual {
        require(_account != address(0), "ERC20: burn from the zero address");
        _balances[_account] -= _amount;
        _totalSupply -= _amount;
        emit Transfer(_account, address(0), _amount);
    }

    /**
     * @dev Internal function to create new tokens for the user
     * @param _account The address which receives minted tokens
     * @param _amount The quantity of tokens to min
     */
    function _mint(address _account, uint256 _amount) internal virtual {
        require(_account != address(0), "ERC20: mint to the zero address");
        _totalSupply += _amount;
        _balances[_account] += _amount;
        emit Transfer(address(0), _account, _amount);
    }

    /**
     * @dev Internal function to perform token transfer
     * @param _sender The address which owns the tokens
     * @param _recipient The destination address
     * @param _amount The quantity of tokens to transfer
     */
    function _transfer(
        address _sender,
        address _recipient,
        uint256 _amount
    ) internal virtual {
        require(_sender != address(0), "ERC20: transfer from the zero address");
        require(
            _recipient != address(0),
            "ERC20: transfer to the zero address"
        );
        _balances[_sender] -= _amount;
        _balances[_recipient] += _amount;
        emit Transfer(_sender, _recipient, _amount);
    }
}
