// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./token/AqETH.sol";

contract Aqua is ERC20, Ownable, ReentrancyGuard {
    
    mapping(address => uint256) private shares;

    uint256 private totalPooledEther;
    uint256 private totalShares;

    event Staked(address indexed user, uint256 amount, uint256 sharesIssued);
    event Withdrawn(address indexed user, uint256 ethAmount, uint256 sharesBurned);
    event RecoveredETH(uint256 amount);

    error DirectETHTransfer();

    AqETH public aqETH;

    constructor(address _aqETH) ERC20("Liquid Staking aqETH", "aqETH") Ownable(msg.sender) {
        require(_aqETH != address(0), "AqETH address cannot be zero.");
        aqETH = AqETH(_aqETH);
    }

    function stakeETH() external payable nonReentrant {
        require(msg.value > 0, "Must stake more than 0.");

        uint256 newShares = msg.value;
        if (totalShares > 0) {
            newShares = (msg.value * totalShares) / totalPooledEther;
        }

        shares[msg.sender] += newShares;
        totalShares += newShares;
        totalPooledEther += msg.value;

        aqETH.mint(msg.sender, newShares);

        emit Staked(msg.sender, msg.value, newShares);
    }

    function withdrawETH(uint256 shareAmount) external nonReentrant {
        require(shareAmount > 0, "Must withdraw more than 0.");
        require(shareAmount <= shares[msg.sender], "Insufficient shares.");

        uint256 ethAmount = (shareAmount * totalPooledEther) / totalShares;

        shares[msg.sender] -= shareAmount;
        totalShares -= shareAmount;
        totalPooledEther -= ethAmount;

        aqETH.burn(msg.sender, shareAmount);
        (bool sent, ) = msg.sender.call{value: ethAmount}("");
        require(sent, "Failed to send ETH.");

        emit Withdrawn(msg.sender, ethAmount, shareAmount);
    }

    function sharesOf(address account) public view returns (uint256) {
        return shares[account];
    }

    function getTotalPooledEther() public view returns (uint256) {
        return totalPooledEther;
    }

    function getTotalShares() public view returns (uint256) {
        return totalShares;
    }

    // Allow contract to receive ETH
    receive() external payable {
        revert DirectETHTransfer();
    }

}