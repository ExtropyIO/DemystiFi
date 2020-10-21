pragma solidity ^0.7.0;
// SPDX-License-Identifier: MIT
import "./Ownable.sol";

contract Demistify is Ownable {
    struct walletDetails {
        uint64 WalletScore;
        string IPFSDetails;
        bool Initialised;
    }

    mapping(address => walletDetails) wallets;

    address[] walletArray;

    modifier walletDoesNotExist(address _wallet) {
        require(wallets[_wallet].Initialised == false, "Wallet Already Exists");
        _;
    }

    modifier walletExists(address _wallet) {
        require(wallets[_wallet].Initialised == true, "Wallet Does Not Exists");
        _;
    }

    event WalletAdded(address _walletAddress, string _IPFSDetails);
    event WalletDeleted(address _walletAddress);
    event ScoreUpdated(address _walletAddress, uint64 _newScore);

    function getDetailsForWallet(address _walletAddress)
        external
        view
        returns (uint64 walletScore_, string memory IPFSDetails_)
    {
        return (
            wallets[_walletAddress].WalletScore,
            wallets[_walletAddress].IPFSDetails
        );
    }

    function getNumberWallets() external view returns (uint256) {
        return walletArray.length;
    }

    function addWallet(address _walletAddress, string calldata _IPFSDetails)
        external
        onlyOwner
        walletDoesNotExist(_walletAddress)
    {
        walletArray.push(_walletAddress);
        wallets[_walletAddress] = walletDetails({
            WalletScore: 50,
            IPFSDetails: _IPFSDetails,
            Initialised: true
        });
        emit WalletAdded(_walletAddress, _IPFSDetails);
    }

    function updateScore(address _walletAddress, uint64 _newScore)
        external
        onlyOwner
        walletExists(_walletAddress)
    {
        require(_newScore <= 100, "Invalid Score Value");
        wallets[_walletAddress].WalletScore = _newScore;
        emit ScoreUpdated(_walletAddress, _newScore);
    }

    function deleteWallet(address _walletAddress)
        external
        onlyOwner
        walletExists(_walletAddress)
    {
        delete wallets[_walletAddress];
        uint256 numberItems = walletArray.length;
        // remove item from array and resize array
        for (uint256 ii = 0; ii < numberItems; ii++) {
            if (walletArray[ii] == _walletAddress) {
                if (numberItems > 1) {
                    walletArray[ii] = walletArray[numberItems - 1];
                }
                walletArray.pop();
                break;
            }
        }
        WalletDeleted(_walletAddress);
    }
}
