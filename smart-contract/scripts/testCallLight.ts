import { EthAdapter } from '@safe-global/safe-core-sdk-types'
import { Signer } from 'ethers'
const { SafeFactory, EthersAdapter } = require('@safe-global/protocol-kit')
const { EthersAdapterAIProtector } = require('sdk')
const { ethers } = require('ethers')

const PROTECTOR = '0x0c79C72D2c22950650eb63Ce58F2BBe0d5a2303e'

if (!process.env.PRIVATE_KEY || !process.env.GOERLI_URL) {
    throw new Error('PRIVATE_KEY not found')
}
const RPC_URL = 'https://eth-goerli.public.blastapi.io'

async function go() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider) as Signer
    const random = ethers.Wallet.createRandom().connect(provider) as Signer
    const random2 = ethers.Wallet.createRandom().connect(provider) as Signer
    if (!signer) throw new Error('Signer not found')

    console.log('Signer contracts with the account:', signer)
    const ethAdapterOwner1 = new EthersAdapterAIProtector({
        ethers,
        signerOrProvider: signer,
        aiProtectorAddress: PROTECTOR,
    }) as EthAdapter

    const owners = [
        await signer.getAddress(),
        await random.getAddress(),
        await random2.getAddress(),
    ]

    console.log('Owners: ', owners)
    console.log('ChainId: ', await signer.getChainId())

    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
    const safeAccountConfig = {
        owners,
        threshold: 2,
    }

    const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })
    const safeAddress = safeSdkOwner1.getAddress()
    console.log('address', safeAddress)

    const safeAmount = ethers.utils.parseUnits('0.01', 'ether').toHexString()

    const transactionParameters = {
        to: safeAddress,
        value: safeAmount,
    }

    const tx = await signer.sendTransaction(transactionParameters)

    console.log('Fundraising.')
    console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`)
}

go()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
