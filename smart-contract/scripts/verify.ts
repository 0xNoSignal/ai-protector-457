async function main() {
    // Verify the contract on Etherscan
    console.log('Verifying the contract on Etherscan...')
    await hre.run('verify:verify', {
        address: '0x8306D642BDDaEd4095753d8f126Cddd583e37662',
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
