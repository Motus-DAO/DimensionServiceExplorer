// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract FractalesNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("Fractales", "FRAC") Ownable(msg.sender) {}

    function mintImage(address to, string memory name, string memory imageBase64) public onlyOwner returns (uint256) {
        uint256 tokenId = ++nextTokenId;
        _safeMint(to, tokenId);
        string memory json = string(abi.encodePacked(
            '{"name":"', name, '",',
            '"description":"Fractales generated image",',
            '"image":"data:image/png;base64,', imageBase64, '"}'
        ));
        string memory encoded = Base64.encode(bytes(json));
        string memory tokenUri = string(abi.encodePacked("data:application/json;base64,", encoded));
        _setTokenURI(tokenId, tokenUri);
        return tokenId;
    }

    function publicMint(string memory name, string memory imageBase64) external returns (uint256) {
        uint256 tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);
        string memory json = string(abi.encodePacked(
            '{"name":"', name, '",',
            '"description":"Fractales generated image",',
            '"image":"data:image/png;base64,', imageBase64, '"}'
        ));
        string memory encoded = Base64.encode(bytes(json));
        string memory tokenUri = string(abi.encodePacked("data:application/json;base64,", encoded));
        _setTokenURI(tokenId, tokenUri);
        return tokenId;
    }
}
