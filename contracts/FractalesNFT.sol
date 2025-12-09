// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title FractalesNFT
 * @dev ERC721 contract for minting NFTs from fractal images
 * @notice Supports on-chain metadata storage with base64-encoded images
 */
contract FractalesNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;

    /**
     * @dev Emitted when a new fractal NFT is minted
     * @param tokenId The ID of the newly minted token
     * @param to The address that received the token
     * @param name The name of the fractal
     */
    event FractalMinted(uint256 indexed tokenId, address indexed to, string name);

    /**
     * @dev Constructor sets the contract owner and initializes the ERC721 token
     * @param initialOwner The address that will own the contract
     */
    constructor(address initialOwner)
        ERC721("Fractales", "FRAC")
        Ownable(initialOwner)
    {}

    /**
     * @dev Returns the next token ID that will be minted
     * @return The next token ID
     */
    function nextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Owner-only function to mint an NFT with a base64-encoded image
     * @param to The address to mint the NFT to
     * @param name The name of the fractal
     * @param imageBase64 The base64-encoded image data (without data URI prefix)
     * @return The token ID of the newly minted NFT
     */
    function mintImage(address to, string memory name, string memory imageBase64) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _buildTokenURI(name, string(abi.encodePacked("data:image/png;base64,", imageBase64))));
        emit FractalMinted(tokenId, to, name);
        return tokenId;
    }

    /**
     * @dev Public function to mint an NFT with a base64-encoded image
     * @param name The name of the fractal
     * @param imageBase64 The base64-encoded image data (without data URI prefix)
     * @return The token ID of the newly minted NFT
     */
    function publicMint(string memory name, string memory imageBase64) 
        external 
        returns (uint256) 
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _buildTokenURI(name, string(abi.encodePacked("data:image/png;base64,", imageBase64))));
        emit FractalMinted(tokenId, msg.sender, name);
        return tokenId;
    }

    /**
     * @dev Public function to mint an NFT with a full data URI
     * @param name The name of the fractal
     * @param dataUri The complete data URI for the image (e.g., "data:image/png;base64,...")
     * @return The token ID of the newly minted NFT
     */
    function publicMintDataURI(string memory name, string memory dataUri) 
        external 
        returns (uint256) 
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _buildTokenURI(name, dataUri));
        emit FractalMinted(tokenId, msg.sender, name);
        return tokenId;
    }

    /**
     * @dev Internal function to build the token URI from name and image
     * @param name The name of the fractal
     * @param imageUri The image URI (can be data URI or external URL)
     * @return The base64-encoded token URI
     */
    function _buildTokenURI(string memory name, string memory imageUri) 
        internal 
        pure 
        returns (string memory) 
    {
        string memory json = string(abi.encodePacked(
            '{"name":"', name, '",',
            '"description":"Fractales generated image",',
            '"image":"', imageUri, '"}'
        ));
        string memory encoded = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", encoded));
    }

    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
