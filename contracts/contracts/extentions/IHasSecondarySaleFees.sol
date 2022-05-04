// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHasSecondarySaleFees {
    function getFeeBps(uint256 id) external view returns (uint256[] memory);

    function getFeeRecipients(uint256 id) external view returns (address payable[] memory);
}
