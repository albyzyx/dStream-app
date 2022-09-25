// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract DStream is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsListed;

    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    mapping(uint256 => VideoItem) private idToVideoItem;

    struct VideoItem {
        uint256 tokenId;
        address author;
        address owner;
        bool isMarketItem;
    }

    struct VideoReturnItem {
        uint256 tokenId;
        address author;
        address owner;
        bool isMarketItem;
        address seller;
        uint256 price;
    }

    event VideoItemUploaded(uint256 tokenId, address author);

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
    }

    event MarketItemCreated(
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price
    );

    // struct ReturnStruct {
    //     VideoItem[] memory videoItems;
    // }

    constructor() ERC721("DStream Tokens", "DSTT") {
        owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    // function updateListingPrice(uint256 _listingPrice) public payable {
    //     require(
    //         owner == msg.sender,
    //         "Only marketplace owner can update listing price."
    //     );
    //     listingPrice = _listingPrice;
    // }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Mints a token and list it*/
    function createToken(string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        makeVideoPublic(newTokenId, false);
        return newTokenId;
    }

    function makeVideoPublic(uint256 tokenId, bool isMarketItem) private {
        idToVideoItem[tokenId] = VideoItem(
            tokenId,
            msg.sender,
            msg.sender,
            isMarketItem
        );
        emit VideoItemUploaded(tokenId, msg.sender);
    }

    function fetchAllVideosWithMarketData()
        public
        view
        returns (VideoReturnItem[] memory)
    {
        uint256 videoItemCount = _tokenIds.current();
        VideoReturnItem[] memory videoReturnItems = new VideoReturnItem[](
            videoItemCount
        );
        for (uint256 i = 0; i < videoItemCount; i++) {
            VideoItem memory currentItem = idToVideoItem[i + 1];
            VideoReturnItem memory currentReturnItem;
            currentReturnItem.tokenId = currentItem.tokenId;
            currentReturnItem.author = currentItem.author;
            currentReturnItem.owner = currentItem.owner;
            currentReturnItem.isMarketItem = currentItem.isMarketItem;

            if (currentItem.isMarketItem == true) {
                MarketItem memory currentMarketItem = idToMarketItem[i + 1];
                currentReturnItem.seller = currentMarketItem.seller;
                currentReturnItem.price = currentMarketItem.price;
            }
            videoReturnItems[i] = currentReturnItem;
        }
        return videoReturnItems;
    }

    function fetchAllMarketplaceVideos()
        public
        view
        returns (VideoReturnItem[] memory)
    {
        uint256 videoItemCount = _tokenIds.current();
        VideoReturnItem[] memory videoReturnItems = new VideoReturnItem[](
            _itemsListed.current()
        );
        for (uint256 i = 0; i < videoItemCount; i++) {
            VideoItem memory currentItem = idToVideoItem[i + 1];
            if (currentItem.isMarketItem == true) {
                VideoReturnItem memory currentReturnItem;
                currentReturnItem.tokenId = currentItem.tokenId;
                currentReturnItem.author = currentItem.author;
                currentReturnItem.owner = currentItem.owner;
                currentReturnItem.isMarketItem = currentItem.isMarketItem;
                MarketItem memory currentMarketItem = idToMarketItem[i + 1];
                currentReturnItem.seller = currentMarketItem.seller;
                currentReturnItem.price = currentMarketItem.price;
                videoReturnItems[i] = currentReturnItem;
            }
        }
        return videoReturnItems;
    }

    function fetchAllAddressVideos(address queryAddress)
        public
        view
        returns (VideoReturnItem[] memory)
    {
        uint256 totalItemCount = _tokenIds.current();
        uint256 senderItemCount = 0;
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToVideoItem[i + 1].owner == queryAddress) {
                senderItemCount++;
            }
        }
        VideoReturnItem[] memory videoReturnItems = new VideoReturnItem[](
            senderItemCount
        );
        for (uint256 i = 0; i < totalItemCount; i++) {
            VideoItem memory currentItem = idToVideoItem[i + 1];
            if (currentItem.owner == msg.sender) {
                VideoReturnItem memory currentReturnItem;
                currentReturnItem.tokenId = currentItem.tokenId;
                currentReturnItem.author = currentItem.author;
                currentReturnItem.owner = currentItem.owner;
                currentReturnItem.isMarketItem = currentItem.isMarketItem;
                if (currentItem.isMarketItem == true) {
                    MarketItem memory currentMarketItem = idToMarketItem[i + 1];
                    currentReturnItem.seller = currentMarketItem.seller;
                    currentReturnItem.price = currentMarketItem.price;
                }
                videoReturnItems[i] = currentReturnItem;
            }
        }
        return videoReturnItems;
    }

    function fetchAllSenderVideos()
        public
        view
        returns (VideoReturnItem[] memory)
    {
        uint256 totalItemCount = _tokenIds.current();
        uint256 senderItemCount = 0;
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToVideoItem[i + 1].owner == msg.sender) {
                senderItemCount++;
            }
        }
        VideoReturnItem[] memory videoReturnItems = new VideoReturnItem[](
            senderItemCount
        );
        for (uint256 i = 0; i < totalItemCount; i++) {
            VideoItem memory currentItem = idToVideoItem[i + 1];
            if (currentItem.owner == msg.sender) {
                VideoReturnItem memory currentReturnItem;
                currentReturnItem.tokenId = currentItem.tokenId;
                currentReturnItem.author = currentItem.author;
                currentReturnItem.owner = currentItem.owner;
                currentReturnItem.isMarketItem = currentItem.isMarketItem;
                if (currentItem.isMarketItem == true) {
                    MarketItem memory currentMarketItem = idToMarketItem[i + 1];
                    currentReturnItem.seller = currentMarketItem.seller;
                    currentReturnItem.price = currentMarketItem.price;
                }
                videoReturnItems[i] = currentReturnItem;
            }
        }
        return videoReturnItems;
    }

    function getVideoItem(uint256 tokenId)
        public
        view
        returns (VideoReturnItem memory)
    {
        //TODO: Check if token exist
        VideoItem memory currentItem = idToVideoItem[tokenId];
        VideoReturnItem memory currentReturnItem;
        currentReturnItem.tokenId = currentItem.tokenId;
        currentReturnItem.author = currentItem.author;
        currentReturnItem.owner = currentItem.owner;
        currentReturnItem.isMarketItem = currentItem.isMarketItem;
        if (currentItem.isMarketItem == true) {
            MarketItem memory currentMarketItem = idToMarketItem[tokenId];
            currentReturnItem.seller = currentMarketItem.seller;
            currentReturnItem.price = currentMarketItem.price;
        }
        return currentReturnItem;
    }

    function listTokenInMarket(uint256 tokenId, uint256 price) public payable {
        require(
            idToVideoItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        idToVideoItem[tokenId].isMarketItem = true;
        MarketItem memory newMarketItem = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price
        );
        idToMarketItem[tokenId] = newMarketItem;
        _itemsListed.increment();
        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(tokenId, msg.sender, address(this), price);
    }

    /* allows someone to resell a token they have purchased */
    // function resellToken(uint256 tokenId, uint256 price) public payable {
    //     require(
    //         idToMarketItem[tokenId].owner == msg.sender,
    //         "Only item owner can perform this operation"
    //     );
    //     require(
    //         msg.value == listingPrice,
    //         "Price must be equal to listing price"
    //     );
    //     idToMarketItem[tokenId].sold = false;
    //     idToMarketItem[tokenId].price = price;
    //     idToMarketItem[tokenId].seller = payable(msg.sender);
    //     idToMarketItem[tokenId].owner = payable(address(this));
    //     _itemsSold.decrement();

    //     _transfer(msg.sender, address(this), tokenId);
    // }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        delete idToMarketItem[tokenId];
        _itemsListed.decrement();
        idToVideoItem[tokenId].owner = msg.sender;
        idToVideoItem[tokenId].isMarketItem = false;

        _transfer(address(this), msg.sender, tokenId);
        // payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);
    }
}
