// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LiteralStrings {
    function toLiteralString(bytes memory input) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory output = new bytes(2 + input.length * 2);
        output[0] = "0";
        output[1] = "x";
        for (uint256 i = 0; i < input.length; i++) {
            output[2 + i * 2] = alphabet[uint256(uint8(input[i] >> 4))];
            output[3 + i * 2] = alphabet[uint256(uint8(input[i] & 0x0f))];
        }
        return string(output);
    }
}
