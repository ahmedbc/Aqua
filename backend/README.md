# Aqua backend

## Installation Instructions

Before you begin, make sure you have [Node.js](https://nodejs.org/) installed. Then, follow these steps to install and set up the Aqua project:

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/ahmedbc/aqua.git
   cd aqua/backend
   ```

2. Create a .env file:
    ```
    touch backend/.env
    ```
    Set the constants
    ```
    PRIVATE_KEY=
    ALCHEMY_RPC_URL=
    ETHERSCAN_API_KEY=
    ```

3. Install the necessary dependencies:
   ```
   npm install
   ```

4. Start a local Hardhat node:
   ```
   npx hardhat node
   ```

5. Deploy the contracts:

   Deploy to localhost
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

   Deploy to Sepolia
    ```
    npx hardhat run scripts/deploy.js --network sepolia
    ```

## Testing

To run the test suite and validate that the contracts are functioning as expected:

    ```
    npx hardhat test
    ```