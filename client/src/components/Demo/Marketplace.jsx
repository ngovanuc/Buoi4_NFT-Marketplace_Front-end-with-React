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

        setListItem(_listItem);
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
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Marketplace</title>
                <style>
                    {`
                        body {
                            margin: 0;
                            padding: 0;
                        }

                        .top {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 80px;
                            background-color: rgb(255, 225, 0);
                        }

                        .left {
                            position: fixed;
                            top: 80px;
                            bottom: 0;
                            left: 0;
                            width: 25%;
                            background-color: black;
                        }

                        .right {
                            margin-left: 25%;
                            margin-top: 80px;
                            height: calc(100vh - 80px);
                            background-color: white;
                            overflow: auto;
                        }

                        .right-content {
                            padding: 20px;
                        }

                        .menu-title {
                            width: 25%;
                            height: 80px;
                            position: fixed;
                            text-align: center;
                        }

                        h1 {
                            font-size: 46px;
                            margin-top: 12px;
                            font-weight: bold;
                        }

                        .nft-address {
                            width: 50%;
                            height: 80px;
                            margin-left: 25%;
                            float: left;
                            text-align: center;
                            font-weight: bold;
                        }

                        .nft-marketplace-address {
                            color: black;
                            font-size: 20px;
                            margin-top: 5px;
                        }

                        .my-collection-address {
                            height: 35px;
                            width: 60%;
                            margin-left: 20%;
                            text-align: center;
                        }

                        .menu {
                            width: 25%;
                            height: 80px;
                            float: right;
                            display: flex;
                            font-size: 20px;
                        }

                        .menu-item {
                            margin-right: 60px;
                            width: 50%;
                            color: black;
                            font-weight: bold;
                            text-align: center;
                            margin-top: 20px;
                        }

                        .menu-item a {
                            color: black;
                            text-decoration: none;
                            transition: color 0.3s ease;
                        }

                        .menu-item a:hover {
                            color: white;
                        }

                        .sell-item {
                            color: white;
                            font-weight: bold;
                            font-size: 30px;
                        }

                        h3 {
                            color: white;
                        }

                        .left-1 {
                            text-align: center;
                        }

                        .left-2 {
                            text-align: center;
                            margin-top: 40px;
                        }

                        .left-3 {
                            text-align: center;
                            margin-top: 15px;
                        }

                        .left-4 {
                            text-align: center;
                            margin-top: 40px;
                        }

                        .left-5 {
                            text-align: center;
                            margin-top: 40px;
                        }

                        .submit-node {
                            width: 120px;
                            height: 45px;
                            border: 0ch;
                            border-radius: 20px;
                            color: gray;
                            font-size: 20px;
                            font-weight: bold;
                            font-family: 'Times New Roman', Times, serif;
                            background-color: yellow;
                        }

                        .submit-node:hover {
                            background-color: aqua;
                            color: black;
                        }

                        input[type="text"] {
                            text-align: center;
                            font-family: 'Times New Roman', Times, serif;
                            font-size: 16px;
                            border: 0cm;
                        }

                        .item-1 {
                            background-color: orange;
                            width: 100%;
                            height: 200px;
                            margin-bottom: 10px;  
                            border-radius: 20px; 
                        }

                        .img-item-1 {
                            width: 20%;
                            height: 100%;
                            // background-color: blue;
                            float: left;
                        }

                        .info-item-1 {
                            width: 70%;
                            height: 100%;
                            // background-color: blueviolet;
                            float: left;
                            max-height: 400px;
                            overflow: auto;
                        }

                        .buy-item-1 {
                            width: 20%;
                            height: 100%;
                            // background-color: rgb(255, 225, 0);
                            float: left;
                        }
                    `}
                </style>
            </head>

            <body>
                <div className="top">
                    <nav className="top">
                        <div className="menu-title">
                            <h1>NFT Marketplace</h1>
                        </div>

                        <div className="nft-address">
                            <p className="nft-marketplace-address">My Collection's address</p>
                            <div className="my-collection-address">
                                <p>{contracts?.MyCollection?.options?.address}</p>
                            </div>
                        </div>

                        <div className="menu">
                            <div className="menu-item">
                                <a href="link_den_trang_web_moi">Marketplace</a>
                            </div>
                            <div className="menu-item">
                                <a href="link_den_trang_web_moi">My Collection</a>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="left">
                    <div className="left-1">
                        <h2 className="sell-item">Sell Item</h2>
                        <p style={{ fontStyle: "italic", color: "white" }}>Sell your items to NFT Marketplace!</p>
                        <br />
                    </div>
                    <div className="left-2">
                        <h3 htmlFor='nftCollection'>NFT Collection Address:</h3>
                        {/* <label htmlFor='nftCollection'>NFT Collection address</label> */}
                        <input
                            type="text"
                            id="nftCollection"
                            name="nftCollection"
                            // className="form-control"
                            value={nftCollection}
                            onChange={event => setNftCollection(event.target.value)}
                            style={{ width: "350px", height: "28px", borderRadius: "5px" }}
                            placeholder="Insert here!"
                        />
                    </div>
                    <div className="left-3">
                        <h3 htmlFor='tokenId'>Token ID:</h3>
                        {/* <label htmlFor='tokenId'>Token ID</label> */}
                        <input
                            type="text"
                            id="tokenId"
                            name="tokenId"
                            // className="form-control"
                            value={tokenId}
                            onChange={event => setTokenId(event.target.value)}
                            style={{
                                width: "150px", height: "28px",
                                borderRadius: "5px"
                            }}
                        />
                    </div>
                    <div className="left-4">
                        <h3 htmlFor='price'>Price (in ETH):</h3>
                        {/* <label htmlFor='price'>Item Price (in Eth)</label> */}
                        <input
                            type="text"
                            id="price"
                            name="price"
                            // className="form-control"
                            value={price}
                            onChange={event => setPrice(event.target.value)}
                            style={{ width: "200px", height: "28px", borderRadius: "5px" }}
                        />
                    </div>
                    <div className="left-5">
                        {/* <input type="submit" className="submit-node" value="Sell now" /> */}
                        <div className="btn btn-primary" onClick={sellNft}>Sell Now</div>
                        <p style={{ fontStyle: "italic", color: "yellow" }}>Warning: Check information carefully before selling!</p>
                    </div>
                </div>

                <div className="right">
                    <div className="right-content">
                        <h2>List Items</h2>
                        {listItem?.map(item =>
                            <div className="item-1">
                                <div className="img-item-1">Image item here</div>
                                <div className="info-item-1">
                                    <h4>#{item.itemId}: {item.name}</h4>
                                    <p>Description: {item.description}</p>
                                    <p>From Collection: {item.nftContract}</p>
                                    <p>Token ID: {item.tokenId.toString()}</p>
                                    <p>Price: {web3.utils.fromWei(item.price, 'ether')}</p>
                                    <p>Seller: {item.seller}</p>
                                    <p>Buyer: {item.buyer}</p>
                                </div>
                                <div className="approve-item-1">
                                    {/* from, seller, buyer address */}
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
                                </div>
                                {/* <div className="buy-item-1"></div> */}
                            </div>

                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}   