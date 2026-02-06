// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TrustScore {
    // Store trust scores for each user
    mapping(address => uint256) public trustScores;
    address public admin;
    uint256 public initialScore = 50; // Initial score for new users
    
    constructor() {
        admin = msg.sender;
    }
    
    // Only admin can update scores
    function updateScore(address user, uint256 score) public {
        require(msg.sender == admin, "Only admin");
        require(score <= 100, "Score must be 0-100");
        trustScores[user] = score;
    }
    
    // Set initial score for new users (admin only)
    function setInitialScore(uint256 _initialScore) public {
        require(msg.sender == admin, "Only admin");
        require(_initialScore <= 100, "Score must be 0-100");
        initialScore = _initialScore;
    }
    
    // Anyone can check a score - returns initialScore if not set
    function getScore(address user) public view returns (uint256) {
        uint256 score = trustScores[user];
        // If score is 0, return initial score (user hasn't been explicitly set)
        return score > 0 ? score : initialScore;
    }
}