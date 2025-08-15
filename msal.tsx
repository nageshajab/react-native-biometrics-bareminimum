import PublicClientApplication, {
  MSALConfiguration,
  MSALInteractiveParams,
  MSALSilentParams,
  MSALResult,
  MSALAccount,
  MSALSignoutParams,
} from 'react-native-msal';
import msalConfig from './msal_config';

class MSALService {
  private pca: PublicClientApplication;

  constructor() {
    this.pca = new PublicClientApplication({
      auth: {
        clientId: '2e989240-a5fc-41c1-8ed2-089f2db5bc4f',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'msauth://com.biometrics/2FJUv0rohqwxD0YdLtUvR0XYCv8=',
      },
    });
  }
  private initPromise: Promise<void> | null = null;

  public async ensureInitialized(): Promise<void> {
    if (!this.initPromise) {
      throw new Error('MSAL initialization was never started.');
    }
    return this.initPromise;
  }
  /**
   * Initialize MSAL before using
   */
  private initialized = false;

  async init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = new Promise(async (resolve, reject) => {
        try {
          console.log('🔄 Starting MSAL init...');
          await this.pca.init();
          this.initialized = true;
          console.log('✅ MSAL init complete');
          resolve();
        } catch (error) {
          console.error('❌ MSAL init error:', error);
          reject(error);
        }
      });
    }
    return this.initPromise;
  }

  /**
   * Interactive sign-in flow
   */
  async signIn(scopes: string[] = ['User.Read']): Promise<MSALResult> {
    const params: MSALInteractiveParams = { scopes };
    const result = await this.pca.acquireToken(params);

    if (!result) {
      throw new Error(
        'Sign-in returned no result (possibly cancelled by user).',
      );
    }

    return result!;
  }
  /**
   * Get all signed-in accounts
   */
  public async getAccounts(): Promise<MSALAccount[]> {
    if (!this.initialized) {
      await this.init();
    }
    return this.pca.getAccounts();
  }
  /**
   * Silent token acquisition
   */
  /**
   * Silently acquire token for a given account and scopes.
   * Falls back to interactive sign-in if silent acquisition fails.
   */
  async getTokenSilent(
    account: MSALAccount,
    scopes: string[] = ['User.Read'],
  ): Promise<MSALResult> {
    // Ensure MSAL is initialized
    if (!this.initialized) {
      await this.init();
    }

    const params: MSALSilentParams = { account, scopes };

    try {
      const result = await this.pca.acquireTokenSilent(params);

      if (!result) {
        throw new Error('Silent token acquisition returned no result.');
      }

      return result!;
    } catch (error) {
      console.warn('Silent token acquisition failed:', error);

      // Fallback to interactive sign-in
      return await this.signIn(scopes);
    }
  }

  /**
   * Sign out
   */
  async signOut(account?: MSALAccount): Promise<void> {
    if (!account) {
      console.warn('No account provided for sign-out.');
      return;
    }
    const params: MSALSignoutParams = { account, signoutFromBrowser: true };
    await this.pca.signOut(params);
  }
}

export const msalService = new MSALService();
