const MyCollection = artifacts.require("MyCollection")

module.exports = async (deployer, network, accounts) => {
    const accountOwner = accounts[0]

    console.info("Account owner: ", accountOwner)
    console.info("Network: ", network)

    const contractMyCollectionParams = [
        "My Collection Name",
        "MCN",
    ]

    await deployer.deploy(MyCollection, ...contractMyCollectionParams)
    const MyCollectionInstance = await MyCollection.deployed()

    console.log("MyCollection deployed at: ", MyCollectionInstance.address)
}