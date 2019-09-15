
var ERC721Mintable = artifacts.require('ERC721Mintable');
const truffleAssert = require('truffle-assertions');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const name = "NFTs_ERC721MintableToken";
    const symbol = "AGT";

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new(name,symbol,{from: account_one});
            // TODO: mint multiple tokens
            await this.contract.mint(account_one,1);
            await this.contract.mint(account_one,2);
            await this.contract.mint(account_one,3);
            await this.contract.mint(account_one,4);
            await this.contract.mint(account_one,5);

        })

        it('should return total supply', async function () { 
            
            let result = await this.contract.totalSupply();
            assert.equal(result, 5, "Return total supply isn't correct");
        })

        it('should get token balance', async function () { 
            let result_account_one = await this.contract.balanceOf(account_one);
            assert.equal(result_account_one, 5, "Return balance of account_one isn't correct");
            let result_account_two = await this.contract.balanceOf(account_two);
            assert.equal(result_account_two, 0, "Return balance of account_two isn't correct");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token URI', async function () { 
            let tokenId = "1";
            const tokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";
            let result = await this.contract.tokenURI(tokenId);
            assert.equal(result, tokenURI, "Return tokenURI isn't correct");
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenId = "1";
            let transferTx = await this.contract.transferFrom(account_one,account_two,tokenId);
            truffleAssert.eventEmitted(transferTx, 'Transfer');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new(name,symbol,{from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let assertStatus = false;
            let tokenId = "6";
            try{
                await this.contract.mint( account_two, tokenId,{from: account_two});
            }
            catch(e){
                assertStatus = true;
            }
            assert.equal( assertStatus, true,"Not only contract owner can mint");
        })

        it('should return contract owner', async function () { 
            let result = await this.contract.owner();
            assert.equal( result, account_one,"Can't return contract owner correctly");
        })

    });
})