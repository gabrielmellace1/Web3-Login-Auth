(function (global) {

    const MetaMaskHelper = {
        authEndpoint: '',
        verifyEndpoint: '',
        apiKeyExpiry: 30, // minutes
        setAuthEndpoint: function (endpoint) {
            this.authEndpoint = endpoint;
        },
        setVerifyEndpoint: function (endpoint) {
            this.verifyEndpoint = endpoint;
        },
        signInWithMetamask: async function () {
            if (typeof window.ethereum !== 'undefined') {
                console.log('Detected Metamask');
                const provider = new ethers.providers.Web3Provider(window.ethereum);

                try {
                    await window.ethereum.enable();
                    console.log('User allowed access to Metamask');

                    const signer = provider.getSigner();
                    const userAddress = await signer.getAddress();
                    console.log('User address:', userAddress);

                    const message = "Please sign this message to confirm your identity.";
                    const signature = await signer.signMessage(message);
                    console.log('Message signed:', signature);

                    const response = await fetch(this.authEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ signature, userAddress })
                    });
                    const res = await response.json();
                    if (res.success) {
                        alert('Authentication successful');
                        localStorage.setItem('apiKey', res.apiKey);
                        localStorage.setItem('userAddress', userAddress);
                        localStorage.setItem('apiKeyCreatedAt', Date.now());
                    } else {
                        alert(res.error);
                    }
                } catch (err) {
                    console.error('Error inside try block:', err);
                }
            } else {
                alert('Metamask is not installed');
            }
        },
        verifyLogin: async function () {
            const apiKey = localStorage.getItem('apiKey');
            const storedUserAddress = localStorage.getItem('userAddress');
            const apiKeyCreatedAt = localStorage.getItem('apiKeyCreatedAt');

            if (!apiKeyCreatedAt || Date.now() - apiKeyCreatedAt > this.apiKeyExpiry * 60 * 1000) {
                // The API key has expired or was never set, sign in again
                await this.signInWithMetamask();
                return false;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const currentWalletAddress = await signer.getAddress();

            if (storedUserAddress !== currentWalletAddress) {
                await this.signInWithMetamask();
                return false;
            }

            if (apiKey) {
                let isValid = false;
                try {
                    const response = await fetch(this.verifyEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'apiKey': apiKey,
                            'userAddress': storedUserAddress
                        })
                    });
                    const res = await response.json();
                    if (res.success) {
                        // The API key is still valid
                        isValid = true;
                    } else {
                        // The API key is not valid, sign in again
                        this.signInWithMetamask();
                    }
                } catch (err) {
                    console.error('Error with ajax call:', err);
                }

                return isValid;
            } else {
                await this.signInWithMetamask();
                return false;
            }
        }
    };

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', async function (accounts) {
            console.log('Accounts changed:', accounts);
            // Automatically sign in with the new account
            await MetaMaskHelper.signInWithMetamask();
        });
    }

    global.MetaMaskHelper = MetaMaskHelper;

}(window));
