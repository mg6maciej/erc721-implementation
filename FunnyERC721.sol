pragma solidity ^0.4.24;

interface ERC721Receiver {

    function onERC721Received(address operator, address from, uint tokenId, bytes data) external returns (bytes4);
}

contract FunnyERC721 {

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    mapping (address => uint) private ownerToTokens;
    address[256] private tokenToOwner;
    address[256] private tokenToApproved;
    mapping (address => mapping (address => bool)) private ownerToApprovedOperators;
    uint public totalSupply;
    mapping (uint => uint) private positionToTokenId;
    
    constructor() public {
        for (uint i = 0; i < 256; i++) {
            positionToTokenId[1 << i] = i;
        }
    }

    function balanceOf(address owner) external view returns (uint) {
        uint count = 0;
        uint tokens = ownerToTokens[owner];
        while (tokens != 0) {
            tokens &= tokens - 1;
            count++;
        }
        return count;
    }

    function ownerOf(uint tokenId) external view returns (address) {
        require(tokenId < totalSupply);
        return tokenToOwner[tokenId];
    }

    function magicTransfer(address to, uint tokens) public {
        require(ownerToTokens[msg.sender] & tokens == tokens);
        ownerToTokens[msg.sender] &= ~tokens;
        ownerToTokens[to] |= tokens;
        while (tokens != 0) {
            uint tokenId = positionToTokenId[tokens & ~(tokens - 1)];
            tokenToOwner[tokenId] = to;
            emit Transfer(msg.sender, to, tokenId);
            tokens &= tokens - 1;
        }
    }

    function transferFrom(address from, address to, uint tokenId) public {
        address owner = tokenToOwner[tokenId];
        require(owner == from);
        require(msg.sender == owner || msg.sender == tokenToApproved[tokenId] || ownerToApprovedOperators[owner][msg.sender]);
        tokenToOwner[tokenId] = to;
        ownerToTokens[from] &= ~(1 << tokenId);
        ownerToTokens[to] |= 1 << tokenId;
        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint tokenId, bytes data) public {
        transferFrom(from, to, tokenId);
        require(ERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) == 0x1111111);
    }

    function safeTransferFrom(address from, address to, uint tokenId) external {
        safeTransferFrom(from, to, tokenId, "");
    }

    function approve(address approved, uint tokenId) external {
        address owner = tokenToOwner[tokenId];
        require(msg.sender == owner || ownerToApprovedOperators[owner][msg.sender]);
        tokenToApproved[tokenId] = approved;
        emit Approval(owner, approved, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        ownerToApprovedOperators[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint tokenId) external view returns (address) {
        return tokenToApproved[tokenId];
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return ownerToApprovedOperators[owner][operator];
    }

    function tokenOfOwnerByIndex(address owner, uint index) external view returns (uint) {
        uint index2 = index;
        uint tokens = ownerToTokens[owner];
        while (index2 > 0) {
            tokens &= tokens - 1;
            index2--;
        }
        return positionToTokenId[tokens & ~(tokens - 1)];
    }

    function tokenByIndex(uint index) external view returns (uint) {
        require(index < totalSupply);
        return index;
    }

    function mint(address to) public {
        uint tokenId = totalSupply;
        totalSupply++;
        require(totalSupply <= 256);
        ownerToTokens[to] |= 1 << tokenId;
        tokenToOwner[tokenId] = to;
        emit Transfer(0, to, tokenId);
    }

    function mintMany(address to, uint amount) public {
        uint tokenId = totalSupply;
        totalSupply += amount;
        require(totalSupply <= 256);
        ownerToTokens[to] |= (2 ** amount - 1) << tokenId;
        for (uint i = 0; i < amount; i++) {
            tokenToOwner[tokenId] = to;
            emit Transfer(0, to, tokenId);
            tokenId++;
        }
    }

    function mintMany(address[] toArray) public {
        uint tokenId = totalSupply;
        totalSupply += toArray.length;
        require(totalSupply <= 256);
        for (uint i = 0; i < toArray.length; i++) {
            address to = toArray[i];
            ownerToTokens[to] |= 1 << tokenId;
            tokenToOwner[tokenId] = to;
            emit Transfer(0, to, tokenId);
            tokenId++;
        }
    }
}
