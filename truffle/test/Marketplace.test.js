const toBN = number => web3.utils.toBN(number)
const parseEther = number => web3.utils.toWei(toBN(number), "ether")

contract("Marketplace", async (accounts) => {
    const Marketplace = artifacts.require("Marketplace")
    const MyCollection = artifacts.require("MyCollection")

    before(async () => {
        this.accountOwner = accounts[0]
        this.account1 = accounts[1]

        this.MyCollectionInstance = await MyCollection.new(
            "My Collection Name",
            "MCN",
        )

        const tokenMetadataName = "Item name 01"
        const tokenMetadataDescription = "Item description 01"
        await this.MyCollectionInstance.mint(
            this.accountOwner,
            tokenMetadataName,
            tokenMetadataDescription,
        )
        const totalSupply = await this.MyCollectionInstance.totalSupply()
        this.latestTokenId = totalSupply.sub(toBN("1"))
        this.MarketplaceInstance = await Marketplace.new()
    })

    it("Should able to sell NFT item", async () => {
        const nftItemPrice = parseEther('1')
        await this.MyCollectionInstance.approve(
            this.MarketplaceInstance.address,
            this.latestTokenId,
        )
        await this.MarketplaceInstance.sellNft(
            this.MyCollectionInstance.address,
            this.latestTokenId,
            nftItemPrice,
        )
        const ownerOfTokenId = await this.MyCollectionInstance.ownerOf(this.latestTokenId)
        const totalItem = await this.MarketplaceInstance.totalItem();
        this.latestItemId = totalItem.sub(toBN('1'))
        const itemListed = await this.MarketplaceInstance.item(this.latestItemId)

        assert.equal(
            ownerOfTokenId,
            this.MarketplaceInstance.address,
            "NFT item does not transfer exactly to Marketplace contract after listed"
        )
        assert.equal(
            itemListed.seller,
            this.accountOwner,
            "NFT item does not have price seller exactly after listed"
        )
        assert.isTrue(
            (itemListed.price).eq(nftItemPrice),
            "NFT item does not have price exactly after listed"
        )
    })

    it("Should able to buy NFT item", async () => {
        const itemListedBefore = await this.MarketplaceInstance.item(this.latestItemId)
        const balanceOfSellerBefore = await web3.eth.getBalance(this.accountOwner)
        await this.MarketplaceInstance.buyNft(this.latestItemId, {
            from: this.account1,
            value: itemListedBefore.price,
        })
        const balanceOfSellerAfter = await web3.eth.getBalance(this.accountOwner)
        const ownerOfTokenIdAfter = await this.MyCollectionInstance.ownerOf(this.latestTokenId)
        const itemListedAfter = await this.MarketplaceInstance.item(this.latestItemId)

        assert.equal(
            ownerOfTokenIdAfter,
            this.account1,
            "NFT item does not have owner exactly after sell"
        )
        assert.equal(
            balanceOfSellerAfter.toString(),
            toBN(balanceOfSellerBefore).add(itemListedBefore.price).toString(),
            "Account seller does not have balance exactly after sell"
        )
        assert.equal(
            itemListedAfter.buyer,
            this.account1,
            "NFT item does not have buyer exactly after sell"
        )
    })
})