// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ContentMonetization is Ownable {
    struct Creator {
        string username;
        uint256 totalTips;
        uint256[] contentList;
    }

    struct Content {
        address creator;
        string title;
        string description;
        uint256 likes;
        uint256 earnings;
        bool isPaid;
    }

    Content[] public posts;
    uint256 public postCount = 0;

    mapping(address => Creator) public creators;
    mapping(address => mapping(uint256 => bool)) public subscriptions;
    address[] public creatorList;

    event CreatorAdded(address indexed creator, string username);
    event ContentPosted(
        address indexed creator,
        uint256 contentIndex,
        bool isPaid
    );
    event ContentLiked(
        address indexed creator,
        uint256 contentIndex,
        address indexed sender,
        uint256 tipAmount
    );
    event SubscriptionPurchased(
        address indexed subscriber,
        address indexed creator,
        uint256 contentIndex
    );

    constructor() {}

    function addContentAndCreator(
        string memory _username,
        string memory _title,
        string memory _description,
        bool _isPaid
    ) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");

        creators[msg.sender] = Creator(_username, 0, new uint256[](0));
        creatorList.push(msg.sender);

        uint256 contentIndex = postCount;
        postCount++;

        Content memory newContent = Content(
            msg.sender,
            _title,
            _description,
            0,
            0,
            _isPaid
        );
        posts.push(newContent);
        creators[msg.sender].contentList.push(contentIndex);

        emit CreatorAdded(msg.sender, _username);
        emit ContentPosted(msg.sender, contentIndex, _isPaid);
    }

    function likeContent(uint256 _contentIndex) external payable {
        require(_contentIndex < postCount, "Content not found");

        Content storage content = posts[_contentIndex];
        require(
            msg.sender != content.creator,
            "Creators cannot like their own content"
        );

        uint256 tipAmount = msg.value;
        require(tipAmount > 0, "Invalid tip amount");

        content.likes += 1;

        address payable creator = payable(content.creator);
        creator.transfer(tipAmount);

        content.earnings += tipAmount;
        creators[creator].totalTips += tipAmount;

        emit ContentLiked(
            content.creator,
            _contentIndex,
            msg.sender,
            tipAmount
        );
    }

    function purchaseSubscription(
        address _creator,
        uint256 _contentIndex
    ) external payable {
        require(
            bytes(creators[_creator].username).length > 0,
            "Creator not found"
        );
        require(_contentIndex < postCount, "Content not found");

        Content storage content = posts[_contentIndex];
        require(content.isPaid, "Content is not paid");
        require(
            !subscriptions[msg.sender][_contentIndex],
            "Subscription already purchased"
        );

        payable(_creator).transfer(0.0001 ether);
        subscriptions[msg.sender][_contentIndex] = true;

        emit SubscriptionPurchased(msg.sender, _creator, _contentIndex);
    }

    function hasSubscription(
        address _subscriber,
        uint256 _contentIndex
    ) external view returns (bool) {
        return subscriptions[_subscriber][_contentIndex];
    }

    function withdrawEarnings() external onlyOwner {
        uint256 earnings = creators[msg.sender].totalTips;
        require(earnings > 0, "No earnings to withdraw");
        creators[msg.sender].totalTips = 0;
        payable(owner()).transfer(earnings);
    }

    function getCreatorContent(
        address _creator
    ) external view returns (uint256[] memory) {
        return creators[_creator].contentList;
    }

    function getPost(
        uint256 _index
    )
        external
        view
        returns (
            address,
            uint256,
            string memory,
            string memory,
            uint256,
            bool,
            string memory
        )
    {
        require(_index < postCount, "Invalid index");
        Content memory post = posts[_index];
        Creator storage creator = creators[post.creator];
        return (
            post.creator,
            _index,
            post.title,
            post.description,
            post.likes,
            post.isPaid,
            creator.username
        );
    }

    function getPostCount() external view returns (uint256) {
        return postCount;
    }
}
