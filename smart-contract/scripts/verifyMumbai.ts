async function main() {
    const CONTRACT_ADDRESS = '0x0c79C72D2c22950650eb63Ce58F2BBe0d5a2303e'
    const WORLD_ADDRESS = '0xD81dE4BCEf43840a2883e5730d014630eA6b7c4A'
    const APP_ID = 'app_75d596ef02783a36908d8436127df8f1'
    const ACTION_ID = 'create-safe'

    if (!WORLD_ADDRESS || !ACTION_ID || !APP_ID) {
        throw Error('GET the env right')
    }

    console.log('Verifying contract on Mumbai Network...')
    await hre.run('verify:verify', {
        network: 'polygon',
        address: CONTRACT_ADDRESS,
        constructorArguments: [WORLD_ADDRESS, APP_ID, ACTION_ID],
    })
    console.log('Contract verification complete.')
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
