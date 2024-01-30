import { useEffect, useState } from "react";
import { useEth } from "../../contexts"

export const Nftcollection = (props) => {
    const { state: { accounts, contracts, web3 } } = useEth();
    const [itemName, setItemName] = useState('')
    const [itemDescription, setItemDescription] = useState('')
    const [listItem, setListItem] = useState([])

    const getListItem = async () => {
        const totalSupply = await contracts.MyCollection.methods.totalSupply().call()
        const _listItem = []
        for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
            const ownerOfTokenId = await contracts.MyCollection.methods.ownerOf(tokenId).call()
            const approvedOfTokenId = await contracts.MyCollection.methods.getApproved(tokenId).call()
            const metadataOfTokenId = await contracts.MyCollection.methods.tokenMetadata(tokenId).call()
            _listItem.push({
                tokenId,
                owner: ownerOfTokenId,
                approved: approvedOfTokenId,
                name: metadataOfTokenId.name,
                description: metadataOfTokenId.description,
            })
        }
        setListItem(_listItem);
    }

    useEffect(() => {
        if (contracts.MyCollection) getListItem()
        return () => setListItem([])
    }, [contracts.MyCollection])

    const createItem = async () => {
        try {
            await web3.eth.sendTransaction({
                from: accounts[0],
                to: contracts.MyCollection.options.address,
                data: contracts.MyCollection.methods.mint(
                    accounts[0],
                    itemName,
                    itemDescription,
                ).encodeABI()
            })
        } catch (error) {
            console.error(error)
        }
        setItemName('')
        setItemDescription('')
        getListItem()
    }

    const handleOnApprove = async (event) => {
        event.preventDefault()
        try {
            await web3.eth.sendTransaction({
                from: accounts[0],
                to: contracts.MyCollection.options.address,
                data: contracts.MyCollection.methods.approve(
                    event.target.approveTo.value,
                    event.target.tokenId.value,
                ).encodeABI()
            })
        } catch (error) {
            console.error(error)
        }
        getListItem()
    }

    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
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
                            /* Cố định vùng top */
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 80px;
                            background-color: black;
                            /* Màu vàng */
                        }

                        .left {
                            position: fixed;
                            /* Cố định vùng left */
                            top: 80px;
                            bottom: 0;
                            left: 0;
                            width: 25%;
                            background-color: aqua;
                        }

                        .right {
                            margin-left: 25%;
                            /* Tự động tính toán phần còn lại của màn hình */
                            margin-top: 80px;
                            /* Để tránh vùng chứa right chồng lên vùng top */
                            height: calc(100vh - 80px);
                            /* Chiều cao của vùng chứa right là toàn bộ chiều cao của màn hình trừ vùng top */
                            background-color: white;
                            /* Màu trắng */
                            overflow: auto;
                            /* Cho phép cuộn nội dung */
                        }

                        .right-content {
                            padding: 20px;
                            /* Thêm padding để nội dung không bị dính vào mép của vùng chứa */
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
                            /* Kích thước tiêu đề */
                            font-weight: bold;
                            /* In đậm */
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
                            color: rgb(255, 225, 0);
                            font-size: 20px;
                            margin-top: 5px;
                        }

                        .my-collection-address {
                            /* background-color: brown; */
                            height: 35px;
                            width: 60%;
                            /* border-radius: 15px; */
                            margin-left: 20%;
                            text-align: center;
                        }

                        .menu {
                            width: 25%;
                            height: 80px;
                            float: right;
                            display: flex;
                            /* Sử dụng Flexbox */
                            font-size: 20px;
                        }

                        .menu-item {
                            margin-right: 60px;
                            width: 50%;
                            /* Khoảng cách giữa hai mục */
                            color: rgb(255, 225, 0);
                            font-weight: bold;
                            text-align: center;
                            /* background-color: brown; */
                            margin-top: 20px;
                        }

                        .menu-item a {
                            color: rgb(255, 225, 0);
                            /* Màu chữ mặc định */
                            text-decoration: none;
                            /* Loại bỏ gạch chân */
                            transition: color 0.3s ease;
                            /* Hiệu ứng màu khi rê chuột qua */
                        }

                        .menu-item a:hover {
                            color: white;
                            /* Màu chữ khi rê chuột qua */
                        }

                        .sell-item {
                            color: black;
                            font-weight: bold;
                            font-size: 30px;
                        }

                        h3 {
                            color: black;
                        }

                        .left-1 {
                            /* background-color: aqua; */
                            width: 100%;
                            height: 70px;
                            text-align: center;
                        }

                        .left-2 {
                            /* background-color: aqua; */
                            text-align: center;
                            margin-top: 40px;
                        }

                        .left-3 {
                            /* background-color: aqua; */
                            margin-top: 15px;
                            // margin-bottom: 40px;
                            /* background-color: aqua; */
                            text-align: center;
                        }

                        .my-textarea {
                            font-family: 'Times New Roman', Times, serif;
                            align-items: center;
                            border-radius: 5px;
                        } 

                        .left-4 {
                            /* background-color: aqua; */
                            text-align: center;
                            margin-top: 40px;
                        }

                        .left-5 {
                            /* background-color: aqua; */
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
                            // background-color: yellow;
                            margin-top: 30px;
                        }

                        .submit-node:hover {
                            background-color: brown;
                            color: white;
                            transition: color 0.3s ease;
                        }

                        input[type="text"] {
                            text-align: center;
                            font-family: 'Times New Roman', Times, serif;
                            font-size: 16px;
                            border: 0cm;
                        }

                        .item-1 {
                            background-color: pink;
                            width: 100%;
                            height: 200px;   
                            margin-bottom: 10px;  
                            border-radius: 20px;   
                            // border: 1px solid black;                                      
                        }

                        .img-item-1 {
                            width: 20%;                    
                            height: 100%;
                            text-align: center;
                            // background-color: blue;
                            float: left;
                        }

                        .info-item-1 {
                            width: 50%;
                            height: 100%;
                            // background-color: blueviolet;
                            float: left;
                            max-height: 400px;
                            overflow: auto;
                        }

                        .approve-item-1 {
                            width: 43;
                            height: 100%;
                            // background-color: rgb(255, 225, 0);
                            float: left;
                        }                        
                        `}
                </style>
            </head>
            <body>
                {/* top - menu title - menu */}
                <div className="top">
                    <nav className="top">
                        <div className="menu-title">
                            <h1 style={{ color: 'rgb(255, 225, 0)' }}>My Collection</h1>
                        </div>

                        <div className="nft-address">
                            <p className="nft-marketplace-address">MFT Marketplace's address</p>
                            <div className="my-collection-address">
                                <p style={{ color: 'rgb(255, 225, 0)' }}>{contracts?.Marketplace?.options?.address}</p>
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

                {/* left - sell item */}
                <div className="left">
                    <div className="left-1">
                        <h2 className="sell-item">Create New Item</h2>
                        <p style={{ fontStyle: 'italic', color: 'brown' }}>Create new items to My Collection!</p>
                        <br />
                    </div>
                    <div className="left-2">
                        {/* <h3>Item name:</h3> */}
                        <label htmlFor='itemName'>Item Name</label>
                        <input
                            type="text"
                            placeholder="Insert here!"
                            id="itemName"
                            name="itemName"
                            className="item-name"
                            value={itemName}
                            onChange={event => setItemName(event.target.value)}
                            style={{ width: '320px', height: '28px', borderRadius: '5px' }}
                        />
                    </div>
                    <div className="left-3">
                        {/* <h3>Description:</h3> */}
                        <label htmlFor='itemDescription'>Item Description</label>
                        <textarea
                            className="my-textarea"
                            rows="6" cols="40"
                            placeholder="Item Description"
                            style={{ fontFamily: "'Times New Roman', Times, serif" }}
                            name="itemDescription"
                            // className="form-control"
                            id="itemDescription"
                            value={itemDescription}
                            onChange={event => setItemDescription(event.target.value)}
                        >

                        </textarea>
                    </div>
                    <div className="left-4">
                        <form action="/upload" method="post" enctype="multipart/form-data">
                            <input type="file" name="image" accept="image/*" />
                            <button type="submit">Tải lên</button>
                        </form>
                    </div>
                    <div className="left-5">
                        {/* <input type="submit" className="submit-node" value="Create New" /> */}
                        <div className="btn btn-primary" onClick={createItem}>Create New</div>
                        <p style={{ fontStyle: 'italic', color: 'brown' }}>Warning: Check information carefully!</p>
                    </div>
                </div>

                {/* right scroll - list of item */}
                <div className="right">
                    <div className="right-content">
                        <h2>List Items</h2>
                        {listItem?.map(item =>
                            <div className="item-1">
                                <div className="img-item-1">Image item here</div>
                                <div className="info-item-1">
                                    {/* Name, price and description here */}
                                    <h4>#{item.tokenId}: {item.name}</h4>
                                    <p>Description: {item.description}</p>
                                    <p>Token ID: {item.tokenId}</p>
                                    <p>Owner: {item.owner}</p>
                                    <p>Approved: {item.approved}</p>
                                </div>
                                <div className="approve-item-1">
                                    {/* from, seller, buyer address */}
                                    <form onSubmit={handleOnApprove}>
                                        <label htmlFor="approveTo">Approve to</label>
                                        <br />
                                        <input
                                            type="text"
                                            name="approveTo"
                                            className="form_control"
                                        />
                                        <input
                                            type="text"
                                            name="tokenId"
                                            defaultValue={item.tokenId}
                                            hidden
                                        />
                                        <br />
                                        <button type="submit" className="btn btn-primary mt-2">Approve</button>
                                    </form>
                                </div>
                                <div className="buy-item-1"></div>
                            </div>

                        )}
                    </div>
                </div>
            </body>
        </html>
    )
}