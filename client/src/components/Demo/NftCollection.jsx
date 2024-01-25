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
        <>
            <h1><b>My Collection</b></h1>
            <p>Address: {contracts?.MyCollection?.options?.address}</p>
            <br />

            <h2>Create Item</h2>
            <label htmlFor='itemName'>Item Name</label>
            <input
                type="text"
                id="itemName"
                name="itemName"
                className="form-control"
                value={itemName}
                onChange={event => setItemName(event.target.value)}
            />
            <br />

            <label htmlFor='itemDescription'>Item Description</label>
            <input
                type="text"
                id="itemDescription"
                name="itemDescription"
                className="form-control"
                value={itemDescription}
                onChange={event => setItemDescription(event.target.value)}
            />
            <br />

            <div className="btn btn-primary" onClick={createItem}>Create</div>

            <div className="mt-5">
                <h2>List Item</h2>
                {listItem?.map(item => <div key={item.tokenId} className="card p-3 my-3">
                    <h4>#{item.tokenId}: {item.name}</h4>
                    <p>Description: {item.description}</p>
                    <p>Token ID: {item.tokenId}</p>
                    <p>Owner: {item.owner}</p>

                    <p>Approved: {item.approved}</p>

                    <form onSubmit={handleOnApprove}>
                        <label htmlFor="approveTo">Approve to</label>
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
                </div>)}
            </div>
        </>
    )
}