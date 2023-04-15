import { expect } from 'chai'
import { ethers } from 'hardhat'
import { prepareWorldID, setUpWorldID } from './helpers/InteractsWithWorldID'
import { AIProtector, JustForTesting } from '../typechain'
import { EthersAdapterAIProtector } from 'sdk'
import { SafeAccountConfig } from '@safe-global/protocol-kit'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { SafeFactory } from '@safe-global/protocol-kit'
import { EthersAdapter } from '@safe-global/protocol-kit'
import { SafeVersion } from '@safe-global/safe-core-sdk-types'
const ACTION_ID = 'wid_test_1234'

describe('AIProtector', function () {
    let aiProtector: AIProtector
    let callerAddr: string
    let testSafe: JustForTesting
    let signer: SignerWithAddress
    let addr2: SignerWithAddress
    let addr3: SignerWithAddress

    this.beforeAll(async () => {
        await prepareWorldID()
    })

    beforeEach(async () => {
        ;[signer, addr2, addr3] = await ethers.getSigners()
        const worldIDAddress = await setUpWorldID()
        const HumanCheckFactory = await ethers.getContractFactory('AIProtector')
        aiProtector = await HumanCheckFactory.deploy(worldIDAddress, 1, ACTION_ID)
        await aiProtector.deployed()
        const TestSafe = await ethers.getContractFactory('JustForTesting')
        testSafe = await TestSafe.deploy()
        await testSafe.deployed()
        callerAddr = await signer.getAddress()
    })

    it('Run create function with DummySAFE', async function () {
        const justForTestingFactory = await ethers.getContractFactory('JustForTesting')
        const justForTesting = await justForTestingFactory.deploy()
        await justForTesting.deployed()
        const initialTotalCalls = await justForTesting.counter()
        const initializer = justForTesting.interface.encodeFunctionData('dummyFunction')
        const owners = [signer.address, addr2.address, addr3.address]
        const tx = await aiProtector.create(
            owners,
            justForTesting.address,
            aiProtector.address,
            initializer,
            1
        )
        await tx.wait()
        const finalTotalCalls = await justForTesting.counter()
        expect(finalTotalCalls).to.equal(initialTotalCalls.add(1))
    })

    // it('Run create function with DummySAFE 2', async function () {
    //     const justForTestingFactory = await ethers.getContractFactory('JustForTesting')
    //     const justForTesting = await justForTestingFactory.deploy()
    //     await justForTesting.deployed()
    //     const initialTotalCalls = await justForTesting.counter()
    //     const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
    //     const signer2 = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    //     const ethAdapterOwner1 = new EthersAdapter({
    //         ethers,
    //         signerOrProvider: signer2,
    //         // aiProtectorAddress: PROTECTOR,
    //     })

    //     const owners = [
    //         await signer.getAddress(),
    //         await addr2.getAddress(),
    //         await addr3.getAddress(),
    //     ]
    //     const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
    //     const safeAccountConfig = {
    //         owners,
    //         threshold: 2,
    //     }
    //     const initializer = await safeFactory['encodeSetupCallData'](safeAccountConfig)
    //     const saltNonce = (Date.now() * 1000 + Math.floor(Math.random() * 1000)).toString()

    //     const tx = await aiProtector.create(
    //         owners,
    //         justForTesting.address,
    //         aiProtector.address,
    //         initializer,
    //         saltNonce
    //     )
    //     await tx.wait()
    //     const finalTotalCalls = await justForTesting.counter()
    //     expect(finalTotalCalls).to.equal(initialTotalCalls.add(1))
    // })
})
