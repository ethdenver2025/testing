import { createWalletClient, custom, http } from 'viem';
import { mainnet } from 'viem/chains';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export class WalletService {
  private static instance: WalletService;
  private walletClient: any = null;
  private address: string | null = null;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  public async initialize(): Promise<void> {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        // Create a wallet client using viem
        this.walletClient = createWalletClient({
          chain: mainnet,
          transport: custom(window.ethereum)
        });
        
        // Request accounts from the wallet
        const [address] = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        this.address = address;
        console.log('Wallet initialized with address:', this.address);
      } catch (error) {
        console.error('Error initializing wallet:', error);
        throw new Error('Failed to initialize wallet');
      }
    } else {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }
  }

  public async getAddress(): Promise<string> {
    if (!this.address) {
      throw new Error('Wallet not initialized');
    }
    return this.address;
  }

  public async signMessage(message: string): Promise<string> {
    if (!this.walletClient || !this.address) {
      throw new Error('Wallet not initialized');
    }
    
    try {
      const signature = await this.walletClient.signMessage({
        account: this.address,
        message
      });
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  public async sendTransaction(tx: any): Promise<any> {
    if (!this.walletClient || !this.address) {
      throw new Error('Wallet not initialized');
    }
    
    try {
      const hash = await this.walletClient.sendTransaction({
        account: this.address,
        ...tx
      });
      return { hash };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  public isInitialized(): boolean {
    return this.walletClient !== null && this.address !== null;
  }

  public getClient(): any {
    return this.walletClient;
  }
}
