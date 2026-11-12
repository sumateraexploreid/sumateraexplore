export const ADMIN_SESSION_COOKIE = "se_admin_session";

export type AdminRole = "super_admin" | "editor" | "cs_operator";

export interface SessionPayload {
  uid: number;
  email: string;
  role: AdminRole;
  exp: number;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSessionToken(
  payload: SessionPayload,
  secret: string,
): Promise<string> {
  const encodedPayload = toBase64Url(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const key = await importHmacKey(secret);
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload),
  );
  return `${encodedPayload}.${toBase64Url(new Uint8Array(sigBuf))}`;
}

export async function verifySessionTokenEdge(
  token: string | undefined,
  secret: string | undefined,
): Promise<SessionPayload | null> {
  if (!token || !secret) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const encodedPayload = token.slice(0, dot);
  const encodedSig = token.slice(dot + 1);
  if (!encodedPayload || !encodedSig) return null;

  try {
    const key = await importHmacKey(secret);
    const sigBytes = fromBase64Url(encodedSig);
    const sigCopy = new Uint8Array(sigBytes.length);
    sigCopy.set(sigBytes);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigCopy,
      new TextEncoder().encode(encodedPayload),
    );
    if (!valid) return null;

    const rawJson = new TextDecoder().decode(fromBase64Url(encodedPayload));
    const parsed = JSON.parse(rawJson) as SessionPayload;
    if (!parsed?.uid || !parsed?.email || !parsed?.role || !parsed?.exp) {
      return null;
    }
    if (Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

