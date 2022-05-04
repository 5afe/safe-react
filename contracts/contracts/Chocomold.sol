// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

import "./extentions/HasSecondarySaleFees.sol";
import "./libraries/IPFS.sol";
import "./libraries/LiteralStrings.sol";

import "hardhat/console.sol";

contract Chocomold is
    Initializable,
    OwnableUpgradeable,
    ERC721Upgradeable,
    ERC721BurnableUpgradeable,
    ERC721PausableUpgradeable,
    HasSecondarySaleFees
{
    using StringsUpgradeable for uint256;
    using IPFS for bytes32;
    using IPFS for bytes;
    using LiteralStrings for bytes;

    mapping(uint256 => bytes32) public ipfsHashMemory;

    string public constant defaultBaseURI = "https://factory.chocomint.app/metadata/";
    string public customBaseURI;

    function initialize(
        address _owner,
        string memory _name,
        string memory _symbol
    ) public initializer {
        __Ownable_init_unchained();
        transferOwnership(_owner);
        __ERC721_init_unchained(_name, _symbol);
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        view
        override(ERC721Upgradeable, HasSecondarySaleFees)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }

    function setDefaultRoyality(address payable[] memory _royaltyAddress, uint256[] memory _royalty) public onlyOwner {
        _setDefaultRoyality(_royaltyAddress, _royalty);
    }

    function setCustomRoyality(
        uint256 _tokenId,
        address payable[] memory _royaltyAddress,
        uint256[] memory _royalty
    ) public onlyOwner {
        _setRoyality(_tokenId, _royaltyAddress, _royalty);
    }

    function setCustomRoyality(
        uint256[] memory _tokenIdList,
        address payable[][] memory _royaltyAddressList,
        uint256[][] memory _royaltyList
    ) public onlyOwner {
        require(
            _tokenIdList.length == _royaltyAddressList.length && _tokenIdList.length == _royaltyList.length,
            "input length must be same"
        );
        for (uint256 i = 0; i < _tokenIdList.length; i++) {
            _setRoyality(_tokenIdList[i], _royaltyAddressList[i], _royaltyList[i]);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return customBaseURI;
    }

    function setCustomBaseURI(string memory _customBaseURI) public onlyOwner {
        customBaseURI = _customBaseURI;
    }

    function _setIpfsHash(uint256 _tokenId, bytes32 _ipfsHash) internal {
        ipfsHashMemory[_tokenId] = _ipfsHash;
    }

    function setIpfsHash(uint256 _tokenId, bytes32 _ipfsHash) public onlyOwner {
        _setIpfsHash(_tokenId, _ipfsHash);
    }

    function setIpfsHash(uint256[] memory _tokenIdList, bytes32[] memory _ipfsHashList) public onlyOwner {
        require(_tokenIdList.length == _ipfsHashList.length, "input length must be same");
        for (uint256 i = 0; i < _tokenIdList.length; i++) {
            _setIpfsHash(_tokenIdList[i], _ipfsHashList[i]);
        }
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "token must exist");
        if (ipfsHashMemory[_tokenId] != "") {
            return string(ipfsHashMemory[_tokenId].addSha256FunctionCodePrefix().toBase58().addIpfsBaseUrlPrefix());
        } else if (bytes(customBaseURI).length > 0) {
            return super.tokenURI(_tokenId);
        } else {
            return
                string(
                    abi.encodePacked(
                        defaultBaseURI,
                        block.chainid.toString(),
                        "/",
                        abi.encodePacked(address(this)).toLiteralString(),
                        "/",
                        _tokenId.toString()
                    )
                );
        }
    }

    function mint(address _to, uint256 _tokenId) public onlyOwner {
        _mint(_to, _tokenId);
    }

    function mint(address[] memory _toList, uint256[] memory _tokenIdList) public onlyOwner {
        require(_toList.length == _tokenIdList.length, "input length must be same");
        for (uint256 i = 0; i < _tokenIdList.length; i++) {
            _mint(_toList[i], _tokenIdList[i]);
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Upgradeable, ERC721PausableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 _tokenId) internal virtual override(ERC721Upgradeable, HasSecondarySaleFees) {
        super._burn(_tokenId);
        if (ipfsHashMemory[_tokenId] != "") {
            delete ipfsHashMemory[_tokenId];
        }
    }
}
