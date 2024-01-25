// SPDX-License-Identifier: MIT
// Dong A University - Smart Contract (lats update: v0.8.18)

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @notice Allows sellers to set a list price of their NFTs thant maybe accepted and
 instantly transferred to the buyer.
 * @dev NFTs with a list price set are escrowed in the market contract.
*/

contract Marketplace {
    using Counters for Counters.Counter;
    Counters.Counter private idCounter;

    struct Item {
        address nftContract;
        uint256 tokenId;
        uint price;
        address seller;
        address buyer;
    }

    mapping(uint256 => Item) public item;

    event Sell(uint256 itemId);
    event Buy(uint256 itemId);

    function totalItem() public view returns (uint256) {
        return idCounter.current();
    }

    function sellNft(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public {
        IERC721(nftContract).transferFrom(msg.sender, address (this), tokenId);
        item[idCounter.current()] = Item(
            nftContract,
            tokenId,
            price,
            msg.sender,
            address(0)
        );
        emit Sell(idCounter.current());
        idCounter.increment();
    }

    function buyNft(uint256 itemId) external payable {
        Item memory _item = item[itemId];
        require(_item.price == msg.value, "Marketplace: only full payments accepted");
        require(_item.seller != address(0), "Marketplace: not for sell");

        IERC721(_item.nftContract).transferFrom(
            address(this),
            msg.sender,
            _item.tokenId
        );
        payable(_item.seller).transfer(msg.value);
        item[itemId].buyer = msg.sender;
        emit Buy(itemId);
    }

}