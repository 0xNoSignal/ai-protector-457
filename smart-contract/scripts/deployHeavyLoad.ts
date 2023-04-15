import { AIProtector__factory } from '../typechain'

async function main() {
    const [deployer] = await hre.ethers.getSigners()
    const WORLD_ADDRESS = process.env.WORLD_ADDRESS
    const APP_ID = process.env.WORLD_APP_ID
    const ACTION_ID = process.env.WORLD_ACTION_ID

    if (!WORLD_ADDRESS || !ACTION_ID || !APP_ID) {
        throw Error('GET the env right')
    }

    console.log('Deploying contracts with the account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    const AIProtectorLight = (await hre.ethers.getContractFactory(
        'AIProtector'
    )) as AIProtector__factory
    const aiProtector = await AIProtectorLight.deploy(WORLD_ADDRESS, APP_ID, ACTION_ID)

    await aiProtector.deployed()

    console.log('AIProtectorLight deployed to:', aiProtector.address)
    console.log(`Checkout: https://wwww.polygonscan.com/address/${aiProtector.address}`)

    // Verify the contract on Etherscan
    console.log('Verifying the contract on Etherscan...')
    await hre.run('verify:verify', {
        address: aiProtector.address,
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
