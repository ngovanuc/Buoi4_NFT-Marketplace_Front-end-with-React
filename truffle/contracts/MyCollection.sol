// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyCollection is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private idCounter;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    struct TokenMetadata {
        string name;
        string description;
    }

    mapping(uint256 => TokenMetadata) public tokenMetadata;

    function totalSupply() public view returns (uint256) {
        return idCounter.current();
    }

    function mint (
        address to,
        string memory name,
        string memory description
    ) public {
        _mint(to, idCounter.current());
        tokenMetadata[idCounter.current()] = TokenMetadata(name, description);
        idCounter.increment();
    }
}
