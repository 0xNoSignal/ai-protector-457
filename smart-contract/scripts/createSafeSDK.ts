import { AIProtector } from '../typechain/AIProtector'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { getSafeContractDeployment } from '@safe-global/protocol-kit/dist/src/contracts/safeDeploymentContracts'
import { SafeVersion } from '@safe-global/safe-core-sdk-types'
import { Signer } from 'ethers'
import { AIProtector__factory } from '../typechain'
const { SafeFactory, EthersAdapter } = require('@safe-global/protocol-kit')
const { EthersAdapterAIProtector } = require('sdk')
const { ethers } = require('ethers')

const PROTECTOR_POLYGON = '0x0c79C72D2c22950650eb63Ce58F2BBe0d5a2303e'
const POLYGON_PROXY = '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2'

if (!process.env.PRIVATE_KEY || !process.env.POLYGON_URL) {
    throw new Error('PRIVATE_KEY not found')
}
async function go() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_URL)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider) as Signer
    const random = ethers.Wallet.createRandom().connect(provider) as Signer
    const random2 = ethers.Wallet.createRandom().connect(provider) as Signer
    if (!signer) throw new Error('Signer not found')

    const aIProtector = AIProtector__factory.connect(PROTECTOR_POLYGON, signer)

    console.log('Signer contracts with the account:', signer)
    const ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
        // aiProtectorAddress: PROTECTOR,
    })

    const owners = [
        await signer.getAddress(),
        await random.getAddress(),
        await random2.getAddress(),
    ]
    console.log('Owners: ', owners)
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
    const safeAccountConfig = {
        owners,
        threshold: 2,
    }
    const initializer = await safeFactory['encodeSetupCallData'](safeAccountConfig)
    const saltNonce = (Date.now() * 1000 + Math.floor(Math.random() * 1000)).toString()
    const safeVersion: SafeVersion = '1.3.0'
    const chainId = await signer.getChainId()
    const singletonDeployment = getSafeContractDeployment(safeVersion, chainId)
    const safeContract = await ethAdapterOwner1.getSafeContract({
        safeVersion,
        chainId,
        singletonDeployment,
    })
    console.log('initializer', initializer)
    console.log('saltNonce', saltNonce)
    console.log('safeMaster', await safeContract.getAddress())
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000)
    const tx = await aIProtector.create(
        owners,
        POLYGON_PROXY,
        await safeContract.getAddress(),
        initializer,
        saltNonce,
        { gasLimit: 1000000, maxFeePerGas, maxPriorityFeePerGas }
    )
    console.log('tx', tx)
    // const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })
    // const safeAddress = safeSdkOwner1.getAddress()
    // console.log('address', safeAddress)
}

go()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
