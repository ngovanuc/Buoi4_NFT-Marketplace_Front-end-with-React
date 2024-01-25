import { useEffect, useState } from "react";
import { useEth } from "../../contexts"

export const Marketplace = (props) => {
    const { state: { accounts, contracts, web3 } } = useEth();

    const [nftCollection, setNftCollection] = useState("")
    const [tokenId, setTokenId] = useState("")
    const [price, setPrice] = useState("")
    const [listItem, setListItem] = useState([])

    const getListItem = async () => {
        const totalItem = await contracts.Marketplace.methods.totalItem().call()
        const _listItem = []
        for (let itemId = 0; itemId < totalItem; itemId++) {
            const itemListed = await contracts.Marketplace.methods.item(itemId).call()
            const metadataOfTokenId = await contracts
                .MyCollection
                .methods
                .tokenMetadata(itemListed.tokenId)
                .call()

            _listItem.push({
                itemId,
                nftContract: itemListed.nftContract,
                tokenId: itemListed.tokenId,
                seller: itemListed.seller,
                buyer: itemListed.buyer,
                price: itemListed.price,
                name: metadataOfTokenId.name,
                description: metadataOfTokenId.description,
            })
        }
    }

    useEffect(() => {
        if (contracts.Marketplace) getListItem()
        return () => setListItem([])
    }, [contracts.Marketplace])

    const sellNft = async () => {
        const priceInWei = web3.utils.toWei(price, 'ether')
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: contracts.Marketplace.options.address,
            data: contracts.Marketplace.methods.sellNft(
                nftCollection,
                tokenId,
                priceInWei,
            ).encodeABI()
        })
        getListItem()
    }

    const handleOnBuyNft = async (event) => {
        event.preventDefault()
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: contracts.Marketplace.options.address,
            data: contracts.Marketplace.methods.buyNft(event.target.itemId.value).encodeABI(),
            value: event.target.price.value,
        })
        getListItem()
    }

    return (
        <>
            <h1><b>Marketplace</b></h1>
            <p>Address: {contracts?.Marketplace?.options?.address}</p>
            <br />

            <h2>Sell Item</h2>
            <label htmlFor='nftCollection'>NFT Collection address</label>
            <input
                type="text"
                id="nftCollection"
                name="nftCollection"
                className="form-control"
                value={nftCollection}
                onChange={event => setNftCollection(event.target.value)}
            />
            <br />

            <label htmlFor='tokenId'>Token ID</label>
            <input
                type="text"
                id="tokenId"
                name="tokenId"
                className="form-control"
                value={tokenId}
                onChange={event => setTokenId(event.target.value)}
            />
            <br />

            <label htmlFor='price'>Item Price (in Eth)</label>
            <input
                type="text"
                id="price"
                name="price"
                className="form-control"
                value={price}
                onChange={event => setPrice(event.target.value)}
            />
            <br />

            <div className="btn btn-primary" onClick={sellNft}>Sell</div>

            <div className="mt-5">
                <h2>List Item</h2>
                {listItem?.map(item => <div key={item.itemId} className="card p-3 my-3">
                    <h4>#{item.itemId}: {item.name}</h4>
                    <p>Description: {item.description}</p>
                    <p>From Collection: {item.nftContract}</p>
                    <p>Token ID: {item.tokenId.toString()}</p>
                    <p>Price: {web3.utils.fromWei(item.price, 'ether')}</p>
                    <p>Seller: {item.seller}</p>
                    <p>Buyer: {item.buyer}</p>

                    <form onSubmit={handleOnBuyNft}>
                        <input
                            type="text"
                            name="itemId"
                            defaultValue={item.itemId}
                            hidden
                        />
                        <input
                            type="text"
                            name="price"
                            defaultValue={item.price.toString()}
                            hidden
                        />
                        <button type="submit" className="btn btn-primary mt-2">Buy</button>
                    </form>

                </div>)}
            </div>
        </>
    )
}