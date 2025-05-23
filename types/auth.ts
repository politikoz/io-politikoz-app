export interface WalletAuthSession {
    jwt: string;
    stakeAddress: string;
    expiresAt: number;
}

export interface SignaturePayload {
    stakeAddress: string;
    timestamp: number;
    nonce: string;
}

export interface SignatureNested {
    signature: string;
    key: string;
}

export interface AuthRequestBody {
    payload: SignaturePayload;
    signature: SignatureNested;
    expiresIn: number;
}

export interface AuthResponse {
    token: string;
    expiresIn: number;
}