// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ERC4626ETH
 * @dev ERC4626 implementation for native ETH.
 */
contract Aqua is ERC20, Ownable, ReentrancyGuard {
    using Math for uint256;

    //mapping(address => uint256) public gainedInterests;
    uint256 private constant INITIAL_EXCHANGE_RATE = 990; // Initial 1 ETH = 1 aqETH for simplicity
    uint256 private constant EXCHANGE_RATE_BASE = 1000; // Base value for calculations
    uint256 private constant MINIMUM_EXCHANGE_RATE = 800;
    uint256 private RATE_DECREASE_STEP = 10e21; // 10,000 ETH in wei for rate adjustment
    uint256 private RATE_DECREASE_PER_STEP = 1; // Decrease rate by 0.001 aqETH per RATE_DECREASE_STEP


    
    event Deposit(address indexed owner, uint256 assets, uint256 shares);
    event Redeem(address indexed owner, uint256 assets, uint256 shares);

    error ExceededMaxDeposit(address staker, uint256 assets, uint256 max);
    error ExceededMaxRedeem(address staker, uint256 shares, uint256 max);

    constructor() ERC20("Aqua staked ETH", "aqETH") Ownable(msg.sender) {}

    function getRateDecreaseStep() external view onlyOwner returns (uint256) {
        return RATE_DECREASE_STEP;
    }

    function getRateDecreasePerStep() external view onlyOwner returns (uint256){
        return RATE_DECREASE_PER_STEP;
    }

    function setRateDecreaseStep(uint256 _newStep) external onlyOwner {
        require(_newStep > 0, "Asset step must be greater than 0.");
        RATE_DECREASE_STEP = _newStep;
    }

    function setRateDecreasePerStep(uint256 _newRateDecrease) external onlyOwner {
        require(_newRateDecrease > 0, "Rate decrease must be greater than 0.");
        RATE_DECREASE_PER_STEP = _newRateDecrease;
    }
    
    function currentExchangeRate() public view returns (uint256) {
        uint256 steps = totalAssets() / RATE_DECREASE_STEP; 
        uint256 rateDecrease = steps * RATE_DECREASE_PER_STEP; 
        uint256 currentRate = INITIAL_EXCHANGE_RATE - rateDecrease;        

        return currentRate < MINIMUM_EXCHANGE_RATE ? MINIMUM_EXCHANGE_RATE : currentRate;
    }


    function totalAssets() public view returns (uint256) {
        return address(this).balance;
    }

    function maxRedeem(address owner) public view virtual returns (uint256) {
        return balanceOf(owner);
    }

    function maxDeposit() public pure returns (uint256) {
        return 5_000 * 1e18; // 10000 ETH
    }

    function previewDeposit(uint256 assets) public view returns (uint256) {
        return _convertToShares(assets);
    }

    function previewRedeem(uint256 shares) public view virtual returns (uint256) {
        return _convertToAssets(shares);
    }

    function deposit() external payable returns (uint256) {
        require(msg.value > 0, "Must deposit more than 0.");
        address staker = msg.sender;
        uint256 assets = msg.value; 
        uint256 maxAssets = maxDeposit();

        if (assets > maxAssets) {
            revert ExceededMaxDeposit(staker, assets, maxAssets);
        }

        uint256 shares = previewDeposit(assets);
        
        _mint(staker, shares);

        emit Deposit(staker, assets, shares);

        return shares;
    }

    function redeem(uint256 shares) external nonReentrant {
        require(shares > 0, "Must withdraw more than 0.");
        address staker = msg.sender;
        uint256 maxShares = maxRedeem(msg.sender);
        

        if(shares > maxShares) {
            revert ExceededMaxRedeem(staker, shares, maxShares);
        }

        uint256 assets = previewRedeem(shares);
        _burn(msg.sender, shares);

        payable(msg.sender).transfer(assets);

        emit Redeem(msg.sender, assets, shares);
    }

    function _convertToShares(uint256 _assets) internal view returns (uint256) {
        uint256 currentRate = currentExchangeRate();
        return _assets.mulDiv(currentRate, EXCHANGE_RATE_BASE);
    }

    function _convertToAssets(uint256 _shares) internal view virtual returns (uint256) {
        uint256 currentRate = currentExchangeRate();
        return _shares.mulDiv(EXCHANGE_RATE_BASE, currentRate);
    }
}