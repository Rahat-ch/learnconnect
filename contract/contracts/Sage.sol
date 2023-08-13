// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Sage is ERC721URIStorage {
    // Mapping from address to whether they've minted the NFT
    mapping(address => bool) public hasMinted;

    // Static URI for the image
    string private constant _defaultTokenURI = "https://bafybeiaylszcyunwgkd5eks3recaikfpsfhxkd2c5vipfr6bv5j35tgjva.ipfs.w3s.link/metadata.json";

    // Counter for token IDs
    uint256 private _currentTokenId = 0;

    constructor() ERC721("Sage", "SNFT") {}

    function mint() external {
        require(!hasMinted[msg.sender], "You have already minted this NFT.");

        _currentTokenId += 1;
        _safeMint(msg.sender, _currentTokenId);
        _setTokenURI(_currentTokenId, _defaultTokenURI);

        hasMinted[msg.sender] = true;
    }
}
