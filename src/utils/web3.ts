import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export const TELOS_TESTNET_RPC = 'https://testnet.telos.net/evm';
export const TELOS_TESTNET_CHAIN_ID = 41;
export const TELOS_TESTNET_CHAIN_ID_HEX = '0x29'; // 41 in hex

export const connectMetaMask = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    // Switch to Telos network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TELOS_TESTNET_CHAIN_ID_HEX }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // If the network is not added, add it first
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: TELOS_TESTNET_CHAIN_ID_HEX,
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
      } else {
        throw switchError;
      }
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    return accounts[0];
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const makePaymentWithTelos = async (amount: number, to: string) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Ensure we're on the correct network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TELOS_TESTNET_CHAIN_ID_HEX }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: TELOS_TESTNET_CHAIN_ID_HEX,
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
      } else {
        throw switchError;
      }
    }

    // Validate the recipient address
    if (!ethers.isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    // Convert amount to Wei
    const amountInWei = ethers.parseEther(amount.toString());

    // Estimate gas
    const gasLimit = await provider.estimateGas({
      to,
      value: amountInWei,
    });

    // Send transaction
    const tx = await signer.sendTransaction({
      to,
      value: amountInWei,
      gasLimit: gasLimit, // Ensuring gas is included
    });

    await tx.wait();
    return tx.hash;
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Transaction rejected by user');
    } else if (error.code === -32603) {
      throw new Error('Network error. Please try again');
    }
    throw error;
  }
};
