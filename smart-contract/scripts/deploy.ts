const hre = require('hardhat')
const { ethers } = require('ethers')

const WORLD_ADDRESS = process.env.WORLD_ADDRESS
const APP_ID = process.env.WORLD_APP_ID
const ACTION_ID = process.env.WORLD_ACTION_ID

async function main() {
    const [deployer] = await hre.ethers.getSigners()

    console.log('Deploying contracts with the account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    const AIProtectorLight = await hre.ethers.getContractFactory('AIProtector')
    const aiProtectorLight = await AIProtectorLight.deploy()

    await aiProtectorLight.deployed()

    console.log('AIProtectorLight deployed to:', aiProtectorLight.address)

    // Verify the contract on Etherscan
    console.log('Verifying the contract on Etherscan...')
    await hre.run('verify:verify', {
        address: aiProtectorLight.address,
        constructorArguments: [],
    })
    console.log('Contract verified on Etherscan.')
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
