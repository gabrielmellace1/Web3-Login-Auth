Web3 Authentication Library
Introduction
This project is a JavaScript library that enables seamless authentication of users in a web3 environment using a signed message from Metamask. The library works in conjunction with a server backend to verify the authenticity of a user's Ethereum wallet and issue an API key that can be used for further secured interactions.

Features
Metamask Integration: The library integrates with the Metamask wallet extension to obtain a user's Ethereum address and a signed message confirming their identity.

API Key Management: Upon successful authentication, the backend server will issue a unique API key that is linked to the authenticated Ethereum address. This key can be stored and used for subsequent requests to the server.

API Key Verification: The library includes functionality to verify the validity of an existing API key, with the option to automatically re-authenticate and obtain a new API key if the existing one is expired or invalid.

User-Friendly Alerts: User-friendly alerts are triggered to inform the user about the authentication status or any errors that may occur.

Support for Wallet Switching: The library automatically detects if the user switches wallets in Metamask and triggers re-authentication with the new wallet.

Easy Integration: Designed to be framework agnostic, the library can be integrated into any JavaScript frontend project regardless of the framework used.

How to Use
Include the metamaskHelper.js file in your project.

Call the setAuthEndpoint and setVerifyEndpoint functions to set your backend's authentication and verification API endpoints.

Use the signInWithMetamask function to authenticate a user with Metamask and obtain an API key.

Use the verifyLogin function to verify an existing API key, with the option to automatically re-authenticate if needed.

For detailed usage instructions, please refer to the example codes in the index.html file and the server-side implementation in app.js and authModule.js.

Requirements
This library is dependent on Ethers.js library. Make sure to include it in your project before using this library.
