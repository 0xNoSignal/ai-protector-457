import * as dotenv from 'dotenv'

import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-dependency-compiler'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

dotenv.config()

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

if (!process.env.MAINNET_URL) {
    throw new Error('Please set your MAINNET_URL in a .env file')
}
const config: HardhatUserConfig = {
    solidity: '0.8.13',
    networks: {
        polygon: {
            url: process.env.POLYGON_URL || '',
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        mumbai: {
            url: process.env.MUMBAI_URL || '',
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        goerli: {
            url: process.env.GOERLI_URL || '',
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        hardhat: {
            forking: {
                url: process.env.MAINNET_URL,
                blockNumber: 17051078,
            },
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: 'USD',
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    dependencyCompiler: {
        paths: [
            '@appliedzkp/semaphore-contracts/base/Verifier.sol',
            '@worldcoin/world-id-contracts/src/Semaphore.sol',
        ],
    },
}

export default config
