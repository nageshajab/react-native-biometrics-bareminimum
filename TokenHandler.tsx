import * as Keychain from 'react-native-keychain';
import { MSALResult } from 'react-native-msal';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export type MSALResultWithClaims = MSALResult & {
  claims: JwtPayload;
};

async function storeToken(msalResult: MSALResult) {
  const tokenPayload = JSON.stringify(msalResult);

  await Keychain.setGenericPassword('msal', tokenPayload, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    service: 'com.yourapp.msalToken',
  });

  // Reset cache with new token
  const claims = jwtDecode(msalResult.idToken!);
  cachedToken = { ...msalResult, claims };
}

let cachedToken: MSALResultWithClaims | null = null;

async function getStoredToken() {
  if (cachedToken) return cachedToken;

  const credentials = await Keychain.getGenericPassword({
    service: 'com.yourapp.msalToken',
  });
  if (credentials) {
    const token: MSALResult = JSON.parse(credentials.password);
    const claims = jwtDecode(token.idToken!);
    cachedToken = { ...token, claims };
    return cachedToken;
  }

  return null;
}
async function clearStoredToken() {
  await Keychain.resetGenericPassword({ service: 'com.yourapp.msalToken' });
  cachedToken = null;
}
export { storeToken, getStoredToken, clearStoredToken };
