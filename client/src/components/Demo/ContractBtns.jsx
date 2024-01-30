// import { useState } from "react";
// import useEth from "../../contexts/EthContext/useEth";

// function ContractBtns({ setValue }) {
//   const { state: { web3, contracts, accounts } } = useEth();
//   const [inputValue, setInputValue] = useState("");

//   const handleInputChange = e => {
//     if (/^\d+$|^$/.test(e.target.value)) {
//       setInputValue(e.target.value);
//     }
//   };

//   const read = async () => {
//     const value = await contracts.SimpleStorage.methods.read().call({ from: accounts[0] });
//     setValue(value);
//   };

//   const write = async e => {
//     if (e.target.tagName === "INPUT") {
//       return;
//     }
//     if (inputValue === "") {
//       alert("Please enter a value to write.");
//       return;
//     }
//     const newValue = parseInt(inputValue);
//     console.log('23')

//     const receipt = await contracts.SimpleStorage.methods.write(newValue).send({
//     from: accounts[0],
//     gasPrice: '10000000000000',
//     gas: 1000000
//     })
//     console.log('abc')
//     console.log(receipt)
//   };

//   return (
//     <div className="btns">

//       <button onClick={read}>
//         read()
//       </button>

//       <div onClick={write} className="input-btn">
//         write(<input
//           type="text"
//           placeholder="uint"
//           value={inputValue}
//           onChange={handleInputChange}
//         />)
//       </div>

//     </div>
//   );
// }

// export default ContractBtns;
