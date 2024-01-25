const toBN = number => web3.utils.toBN(number)

contract("MyCollection", async (accounts) => {
    const MyCollection = artifacts.require("MyCollection")
    const myCollectionName = "My Collection Name"
    const myCollectionSymbol = "MCN"

    before(async () => {
        this.accountOwner = accounts[0]
        this.account1 = accounts[1]
        this.MyCollectionInstance = await MyCollection.new(
            myCollectionName,
            myCollectionSymbol,
        )
    })

    it("Should have token information", async () => {
        const name = await this.MyCollectionInstance.name()
        const symbol = await this.MyCollectionInstance.symbol()

        assert.equal(
            name,
            myCollectionName,
            "My Collection does not have name correctly"
        )
        assert.equal(
            symbol,
            myCollectionSymbol,
            "My Collection does not have symbol correctly"
        )
    })

    it("Should able to mint token", async () => {
        const tokenMetadataName = "NFT item 01 name"
        const tokenMetadataDescription = "NFT item 01 description"

        const nftBalanceOfAccountBefore = await this.MyCollectionInstance.balanceOf(
            this.accountOwner,
        )
        await this.MyCollectionInstance.mint(
            this.accountOwner,
            tokenMetadataName,
            tokenMetadataDescription,
        )
        const nftBalanceOfAccountAfter = await this.MyCollectionInstance.balanceOf(
            this.accountOwner
        )

        const totalSupply = await this.MyCollectionInstance.totalSupply()
        const latestTokenId = totalSupply.sub(toBN('1'))
        const ownerOfTokenId = await this.MyCollectionInstance.ownerOf(latestTokenId)
        const metadataOfTokenId = await this.MyCollectionInstance.tokenMetadata(latestTokenId)

        assert.isTrue(
            nftBalanceOfAccountAfter.eq(nftBalanceOfAccountBefore.add(toBN('1'))),
            "NFT balance of account does not increment exactly"
        )
        assert.equal(
            ownerOfTokenId,
            this.accountOwner,
            "Item does not have owner exactly"
        )
        assert.equal(
            metadataOfTokenId.name,
            tokenMetadataName,
            "Item does not have name exactly"
        )
        assert.equal(
            metadataOfTokenId.description,
            tokenMetadataDescription,
            "Item does not have description exactly"
        )
    })

    it("Should able to transfer token to another account", async () => {
        const tokenMetadataName = "NFT item 01 name"
        const tokenMetadataDescription = "NFT item 01 description"

        await this.MyCollectionInstance.mint(
            this.accountOwner,
            tokenMetadataName,
            tokenMetadataDescription,
        )
        const totalSupply = await this.MyCollectionInstance.totalSupply()
        const latestTokenId = totalSupply.sub(toBN('1'))

        const ownerOfTokenIdBefore = await this.MyCollectionInstance.ownerOf(latestTokenId)
        await this.MyCollectionInstance.transferFrom(
            this.accountOwner,
            this.account1,
            latestTokenId,
        )
        const ownerOfTokenIdAfter = await this.MyCollectionInstance.ownerOf(latestTokenId)
        assert.equal(
            ownerOfTokenIdBefore,
            this.accountOwner,
            "Item does not have owner exactly before transfer"
        )
        assert.equal(
            ownerOfTokenIdAfter,
            this.account1,
            "Item does not have owner exactly after transfer"
        )
    })

    it("Should able to approve token to another account", async () => {
        const tokenMetadataName = "NFT item 01 name"
        const tokenMetadataDescription = "NFT item 01 description"

        await this.MyCollectionInstance.mint(
            this.accountOwner,
            tokenMetadataName,
            tokenMetadataDescription,
        )
        const totalSupply = await this.MyCollectionInstance.totalSupply()
        const latestTokenId = totalSupply.sub(toBN('1'))

        const ownerOfTokenIdBefore = await this.MyCollectionInstance.ownerOf(latestTokenId)
        await this.MyCollectionInstance.approve(
            this.account1,
            latestTokenId,
        )
        const ownerOfTokenIdAfter = await this.MyCollectionInstance.ownerOf(latestTokenId)
        const approveOfTokenIdAfter = await this.MyCollectionInstance.getApproved(latestTokenId)

        assert.equal(
            ownerOfTokenIdBefore,
            ownerOfTokenIdAfter,
            "Item does not have owner exactly after approve"
        )
        assert.equal(
            approveOfTokenIdAfter,
            this.account1,
            "Item does not have approve exactly after approve"
        )
    })
})