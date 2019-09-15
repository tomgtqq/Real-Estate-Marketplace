const Verifier = artifacts.require('Verifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const truffleAssert = require('truffle-assertions');
const proof_json= require("../../zokrates/code/square/proof.json");

// - use the contents from proof.json generated from zokrates steps
const proofData = {
    "proof": {
            "A": [web3.utils.toBN(proof_json.proof.A[0]).toString(), web3.utils.toBN(proof_json.proof.A[1]).toString()],
            "A_p": [web3.utils.toBN(proof_json.proof.A_p[0]).toString(), web3.utils.toBN(proof_json.proof.A_p[1]).toString()],
            "B": [[web3.utils.toBN(proof_json.proof.B[0][0]).toString(), web3.utils.toBN(proof_json.proof.B[0][1]).toString()],
                [web3.utils.toBN(proof_json.proof.B[1][0]).toString(), web3.utils.toBN(proof_json.proof.B[1][1]).toString()]
            ],
            "B_p": [web3.utils.toBN(proof_json.proof.B_p[0]).toString(), web3.utils.toBN(proof_json.proof.B_p[1]).toString()],
            "C": [web3.utils.toBN(proof_json.proof.C[0]).toString(), web3.utils.toBN(proof_json.proof.C[1]).toString()],
            "C_p": [web3.utils.toBN(proof_json.proof.C_p[0]).toString(), web3.utils.toBN(proof_json.proof.C_p[1]).toString()],
            "H": [web3.utils.toBN(proof_json.proof.H[0]).toString(), web3.utils.toBN(proof_json.proof.H[1]).toString()],
            "K": [web3.utils.toBN(proof_json.proof.K[0]).toString(), web3.utils.toBN(proof_json.proof.K[1]).toString()]
        },
        "input": proof_json.input
    }

    contract('SolnSquareVerifier', accounts => {

    const name = "NFTs_ERC721MintableToken";
    const symbol = "AGT";

    describe('Test solution verified and mint a token', () => {
        before(async() => { 
            const verifier = await Verifier.new({from: accounts[0]});
            this.contract = await SolnSquareVerifier.new(verifier.address,name,symbol,{from: accounts[0]});
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('should add a solution and emit SolutionAdded', async() => {
            let transferTx = await this.contract.addToSolutions(
                proofData.proof.A,
                proofData.proof.A_p,
                proofData.proof.B,
                proofData.proof.B_p,
                proofData.proof.C,
                proofData.proof.C_p,
                proofData.proof.H,
                proofData.proof.K,
                proofData.input,
                {from: accounts[0]}
            );
            truffleAssert.eventEmitted(transferTx, 'SolutionAdded');
        });

        //Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint a token and emit Transfer', async() => {
            let transferTx = await this.contract.mintNFT(9, 1, accounts[1], {from: accounts[0]}) 
            truffleAssert.eventEmitted(transferTx, 'Transfer', (ev) => {
                return (ev.to == accounts[1] && ev.tokenId == 0);
            });
        });
    })
})