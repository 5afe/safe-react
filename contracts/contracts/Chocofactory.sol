// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

interface IChocoInitializable {
    function initialize(
        string memory _name,
        string memory _symbol,
        address _owner
    ) external;
}

contract Chocofactory is EIP712 {
    using Address for address;
    using Clones for address;
    using ECDSA for bytes32;

    event Deployed(
        address indexed owner,
        address indexed implementation,
        address indexed deployedContract,
        string name,
        string symbol
    );

    constructor(string memory name, string memory version) EIP712(name, version) {}

    function _encode(
        address owner,
        string memory name,
        string memory symbol
    ) internal pure returns (bytes memory) {
        return abi.encodeWithSignature("initialize(address,string,string)", owner, name, symbol);
    }

    function _deploy(
        address implementation,
        address owner,
        string memory name,
        string memory symbol
    ) internal {
        bytes memory data = _encode(owner, name, symbol);
        bytes32 salt = keccak256(abi.encodePacked(data, owner));
        address deployedContract = implementation.cloneDeterministic(salt);
        deployedContract.functionCallWithValue(data, msg.value);
        emit Deployed(owner, implementation, deployedContract, name, symbol);
    }

    function deploy(
        address implementation,
        string memory name,
        string memory symbol
    ) public payable {
        _deploy(implementation, msg.sender, name, symbol);
    }

    function verifySig(
        address implementation,
        address owner,
        string memory name,
        string memory symbol,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 digest =
            keccak256(abi.encodePacked(block.chainid, address(this), implementation, name, symbol))
                .toEthSignedMessageHash();
        address recovered = digest.recover(signature);
        return owner == recovered;
    }

    function deployWithSig(
        address implementation,
        address owner,
        string memory name,
        string memory symbol,
        bytes memory signature
    ) public payable {
        require(verifySig(implementation, owner, name, symbol, signature), "signature must be valid");
        _deploy(implementation, owner, name, symbol);
    }

    function verifyTypedSig(
        address implementation,
        address owner,
        string memory name,
        string memory symbol,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 digest =
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256("Choco(address implementation,string name,string symbol)"),
                        implementation,
                        keccak256(bytes(name)),
                        keccak256(bytes(symbol))
                    )
                )
            );
        address recovered = digest.recover(signature);
        return owner == recovered;
    }

    function deployWithTypedSig(
        address implementation,
        address owner,
        string memory name,
        string memory symbol,
        bytes memory signature
    ) public payable {
        require(verifyTypedSig(implementation, owner, name, symbol, signature), "signature must be valid");
        _deploy(implementation, owner, name, symbol);
    }

    function predictDeployResult(
        address implementation,
        address owner,
        string memory name,
        string memory symbol
    ) public view returns (address) {
        bytes memory data = _encode(owner, name, symbol);
        bytes32 salt = keccak256(abi.encodePacked(data, owner));
        return implementation.predictDeterministicAddress(salt, address(this));
    }
}
