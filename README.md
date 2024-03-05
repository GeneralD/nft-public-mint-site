# NFT Public Minting Website

This is a website for minting NFTs on the Ethereum blockchain. It is built using React.

# Make your NFTs compatible with this project

To make your NFTs compatible with this project, you need to implement the following interface in your smart contract.

```solidity:IPublicMintable.sol
// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2024 Yumenosuke Kokata

pragma solidity >=0.8.18;

interface IPublicMintable {
    /**
     * @notice emitted when public minting price is changed
     * @param price new price of each token in public minting
     */
    event PublicMintPriceChanged(uint256 price);

    /**
     * @notice emitted when public minting period is changed
     * @param startTimestamp timestamp to start public minting
     * @param endTimestamp timestamp to end public minting
     */
    event PublicMintAvailablePeriodChanged(uint256 startTimestamp, uint256 endTimestamp);

    /**
     * @notice emitted when public minting is executed
     */
    event PublicMinted(address to, uint256 startTokenId, uint256 amount);

    /**
     * @notice price of each token in public minting
     */
    function publicMintPrice() external view returns (uint256);

    /**
     * @notice timestamp to allow public minting
     */
    function publicMintStartTimestamp() external view returns (uint256);

    /**
     * @notice timestamp to end public minting
     */
    function publicMintEndTimestamp() external view returns (uint256);

    /**
     * @notice token id of the last token that can be minted in public minting
     */
    function publicMintLastTokenId() external view returns (uint256);

    /**
     * @notice mint tokens for public sale
     * @param amount amount of tokens to mint
     */
    function publicMint(uint256 amount) external payable;
}
```

Additionally, you need to implement the following interfaces in your smart contract.

- ERC721
- ERC721Enumerable
- ERC721URIMetadata
