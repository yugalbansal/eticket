import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export const TELOS_TESTNET_RPC = 'https://testnet.telos.net/evm';
export const TELOS_TESTNET_CHAIN_ID = 41;

export const connectMetaMask = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Switch to Telos network
    await switchToTelosNetwork();

    return accounts[0];
  } catch (error: any) {
    console.error('MetaMask connection error:', error);
    if (error.code === 4001) {
      throw new Error('Please connect your MetaMask wallet');
    }
    throw error;
  }
};

const switchToTelosNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${TELOS_TESTNET_CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
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
        throw new Error('Failed to add Telos network to MetaMask');
      }
    } else {
      throw new Error('Failed to switch to Telos network');
    }
  }
};

export const makePaymentWithTelos = async (amount: number, to: string) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    // Ensure we're connected to MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('Please connect your MetaMask wallet');
    }

    // Ensure we're on Telos network
    await switchToTelosNetwork();

    // Validate the recipient address
    if (!ethers.isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Prepare the transaction
    const amountInWei = ethers.parseEther(amount.toString());
    
    // Get the current gas price
    const gasPrice = await provider.getGasPrice();

    // Estimate gas limit
    const gasLimit = await provider.estimateGas({
      to,
      value: amountInWei,
      from: accounts[0]
    });

    // Send transaction
    const tx = await signer.sendTransaction({
      to,
      value: amountInWei,
      gasLimit: gasLimit * BigInt(2), // Add some buffer
      gasPrice
    });

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    if (!receipt) {
      throw new Error('Transaction failed');
    }

    return tx.hash;
  } catch (error: any) {
    console.error('Payment error:', error);
    
    if (error.code === 4001) {
      throw new Error('Transaction rejected by user');
    } else if (error.code === -32603) {
      throw new Error('Insufficient funds or network error');
    } else if (error.message.includes('insufficient funds')) {
      throw new Error('Insufficient funds in your wallet');
    } else if (error.message.includes('gas')) {
      throw new Error('Gas estimation failed. Please try again');
    }
    
    throw new Error(error.message || 'Payment failed. Please try again.');
  }
};