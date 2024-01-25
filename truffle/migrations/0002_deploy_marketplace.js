const Marketplace = artifacts.require("Marketplace")

module.exports = async (deployer, network, accounts) => {
    const accountOwner = accounts[0]

    console.info("Account owner: ", accountOwner)
    console.info("Network: ", network)

    const contractMarketplaceParams = [
        "My Collection Name",
        "MCN",
    ]

    await deployer.deploy(Marketplace, ...contractMarketplaceParams)
    const MarketplaceInstance = await Marketplace.deployed()

    console.log("Marketplace deployed at: ", MarketplaceInstance.address)
}