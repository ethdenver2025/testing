import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

export class WalletService {
  private static instance: WalletService;
  private provider: Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  public async initialize(): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.signer = this.provider.getSigner();
    } else {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }
  }

  public async getAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not initialized');
    }
    return await this.signer.getAddress();
  }

  public async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not initialized');
    }
    return await this.signer.signMessage(message);
  }

  public async sendTransaction(tx: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Wallet not initialized');
    }
    return await this.signer.sendTransaction(tx);
  }

  public isInitialized(): boolean {
    return this.signer !== null;
  }

  public getProvider(): Web3Provider | null {
    return this.provider;
  }

  public getSigner(): ethers.Signer | null {
    return this.signer;
  }
}
