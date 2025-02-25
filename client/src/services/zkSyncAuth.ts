import { SSOProvider } from '@zksync/sso-sdk';
import { ethers } from 'ethers';

class ZKSyncAuth {
  private ssoProvider: SSOProvider;
  private static instance: ZKSyncAuth;

  private constructor() {
    this.ssoProvider = new SSOProvider({
      projectId: process.env.ZKSYNC_PROJECT_ID || '',
      network: 'mainnet',
    });
  }

  public static getInstance(): ZKSyncAuth {
    if (!ZKSyncAuth.instance) {
      ZKSyncAuth.instance = new ZKSyncAuth();
    }
    return ZKSyncAuth.instance;
  }

  public async login(): Promise<{
    address: string;
    token: string;
  }> {
    try {
      // Connect and get user's address
      const address = await this.ssoProvider.connect();

      // Get authentication token
      const token = await this.ssoProvider.authenticate();

      // Store session
      localStorage.setItem('zk_token', token);
      localStorage.setItem('zk_address', address);

      return { address, token };
    } catch (error) {
      console.error('ZKSync SSO login failed:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.ssoProvider.disconnect();
      localStorage.removeItem('zk_token');
      localStorage.removeItem('zk_address');
    } catch (error) {
      console.error('ZKSync SSO logout failed:', error);
      throw error;
    }
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('zk_token');
  }

  public async getAuthToken(): Promise<string | null> {
    const token = localStorage.getItem('zk_token');
    if (!token) return null;

    // Check if token is expired and refresh if needed
    if (await this.ssoProvider.isTokenExpired(token)) {
      try {
        const newToken = await this.ssoProvider.authenticate();
        localStorage.setItem('zk_token', newToken);
        return newToken;
      } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
      }
    }

    return token;
  }

  public async getAddress(): Promise<string | null> {
    return localStorage.getItem('zk_address');
  }

  // Helper method to get signer for transactions
  public async getSigner(): Promise<ethers.Signer | null> {
    try {
      const provider = await this.ssoProvider.getProvider();
      return provider.getSigner();
    } catch (error) {
      console.error('Failed to get signer:', error);
      return null;
    }
  }
}

export default ZKSyncAuth;
