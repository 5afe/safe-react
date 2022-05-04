// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library IPFS {
    function addSha256FunctionCodePrefix(bytes32 _input) internal pure returns (bytes memory) {
        return abi.encodePacked(hex"1220", _input);
    }

    function addIpfsBaseUrlPrefix(bytes memory _input) internal pure returns (bytes memory) {
        return abi.encodePacked("ipfs://", _input);
    }

    function toBase58(bytes memory _input) internal pure returns (bytes memory) {
        bytes memory alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        uint8[] memory digits = new uint8[](46);
        bytes memory output = new bytes(46);
        digits[0] = 0;
        uint8 digitlength = 1;
        for (uint256 i = 0; i < _input.length; ++i) {
            uint256 carry = uint8(_input[i]);
            for (uint256 j = 0; j < digitlength; ++j) {
                carry += uint256(digits[j]) * 256;
                digits[j] = uint8(carry % 58);
                carry = carry / 58;
            }
            while (carry > 0) {
                digits[digitlength] = uint8(carry % 58);
                digitlength++;
                carry = carry / 58;
            }
        }
        for (uint256 k = 0; k < digitlength; k++) {
            output[k] = alphabet[digits[digitlength - 1 - k]];
        }
        return output;
    }
}
