import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import HelloWorldABI from './HelloWorld.json'; // Import ABI from file
import './App.css'; // Import the CSS file for styling

const App = () => {
    const [greeting, setGreeting] = useState('');
    const [newGreeting, setNewGreeting] = useState('');
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [sum, setSum] = useState(null);

    useEffect(() => {
        async function initContract() {
            try {
                const web3 = new Web3(window.ethereum);
                const userAccounts = await web3.eth.requestAccounts();
                setAccounts(userAccounts);
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = HelloWorldABI.networks[networkId];
                const contractInstance = new web3.eth.Contract(
                    HelloWorldABI.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                setContract(contractInstance);
                const initialGreeting = await contractInstance.methods.getGreeting().call({ from: userAccounts[0] });
                setGreeting(initialGreeting);
            } catch (error) {
                console.error('Error connecting to contract:', error);
            }
        }
        initContract();
    }, []);

    const handleGreetingChange = async () => {
        try {
            if (contract && accounts.length > 0) {
                console.log('Sending transaction to set new greeting:', newGreeting);
                await contract.methods.setGreeting(newGreeting).send({ from: accounts[0] })
                    .on('transactionHash', function(hash){
                        console.log('Transaction hash:', hash);
                    })
                    .on('confirmation', function(confirmationNumber, receipt){
                        console.log('Transaction confirmation:', confirmationNumber, receipt);
                    })
                    .on('receipt', function(receipt){
                        console.log('Transaction receipt:', receipt);
                    });

                console.log('Transaction sent, fetching updated greeting...');
                const updatedGreeting = await contract.methods.getGreeting().call({ from: accounts[0] });
                console.log('Updated greeting from contract:', updatedGreeting);
                setGreeting(updatedGreeting);
                setNewGreeting('');
            }
        } catch (error) {
            console.error('Error updating greeting:', error);
        }
    };

    const handleAddition = () => {
        const number1 = parseFloat(num1);
        const number2 = parseFloat(num2);
        if (!isNaN(number1) && !isNaN(number2)) {
            setSum(number1 + number2);
        } else {
            setSum('Invalid input');
        }
    };

    return (
        <div className="app-container">
            <div className="greeting-section">
                <h1>Hello, World!</h1>
                <p className="greeting">Greeting from contract: {greeting}</p>
                <input
                    type="text"
                    value={newGreeting}
                    onChange={(e) => setNewGreeting(e.target.value)}
                    placeholder="Enter new greeting"
                    className="input"
                />
                <button onClick={handleGreetingChange} className="button">Update Greeting</button>
            </div>

            <div className="addition-section">
                <h1>Add Two Numbers</h1>
                <input
                    type="text"
                    value={num1}
                    onChange={(e) => setNum1(e.target.value)}
                    placeholder="Enter first number"
                    className="input"
                />
                <input
                    type="text"
                    value={num2}
                    onChange={(e) => setNum2(e.target.value)}
                    placeholder="Enter second number"
                    className="input"
                />
                <button onClick={handleAddition} className="button">Add</button>
                {sum !== null && <p className="result">Sum: {sum}</p>}
            </div>
        </div>
    );
};

export default App;
