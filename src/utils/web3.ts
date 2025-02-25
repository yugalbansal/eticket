import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export const TELOS_TESTNET_RPC = 'https://testnet.telos.net/evm';
export const TELOS_TESTNET_CHAIN_ID = 41;

/**
 * Connects MetaMask and switches to Telos Testnet.
 */
export const connectMetaMask = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('❌ MetaMask is not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      throw new Error('❌ No accounts found');
    }

    // Switch to Telos Testnet
    await switchToTelosNetwork();

    return accounts[0]; // Return the connected account
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

/**
 * Switches MetaMask to the Telos Testnet.
 */
const switchToTelosNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${TELOS_TESTNET_CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${TELOS_TESTNET_CHAIN_ID.toString(16)}`,
            chainName: 'Telos Testnet',
            nativeCurrency: {
              name: 'TLOS',
              symbol: 'TLOS',
              decimals: 18
            },
            rpcUrls: [TELOS_TESTNET_RPC],
            blockExplorerUrls: ['https://testnet.teloscan.io/']
          }]
        });
      } catch (addError) {
        throw new Error('❌ Failed to add Telos network to MetaMask');
      }
    } else {
      throw new Error('❌ Failed to switch to Telos network');
    }
  }
};

/**
 * Sends a Telos transaction using MetaMask.
 */
export const makePaymentWithTelos = async (amount: number, to: string) => {
  try {
    if (!window.ethereum) {
      throw new Error('❌ MetaMask is not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Ensure we're on Telos network
    await switchToTelosNetwork();

    // Validate the recipient address
    try {
      ethers.getAddress(to); // Validate address in ethers v6
    } catch (error) {
      throw new Error('❌ Invalid recipient address');
    }

    // Prepare the transaction
    const amountInWei = ethers.parseEther(amount.toString());

    // Send the transaction
    const tx = await signer.sendTransaction({
      to,
      value: amountInWei,
      chainId: TELOS_TESTNET_CHAIN_ID
    });

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error('❌ Transaction failed');
    }

    toast.success(`✅ Transaction successful! Hash: ${tx.hash}`);
    return tx.hash;
  } catch (error: any) {
    console.error('❌ Payment error:', error);

    if (error.code === 4001) {
      throw new Error('🚫 Transaction rejected by user');
    } else if (error.code === -32603) {
      throw new Error('⚠️ Network error. Please try again');
    } else if (error.message.includes('insufficient funds')) {
      throw new Error('💰 Insufficient funds in your wallet');
    } else if (error.message.includes('gas')) {
      throw new Error('⚠️ Gas estimation failed. Try increasing gas limit');
    }

    throw new Error(error.message || '❌ Payment failed. Please try again.');
  }
};
