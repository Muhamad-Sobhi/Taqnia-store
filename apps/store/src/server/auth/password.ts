import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const scryptCost = 32_768;
const scryptBlockSize = 8;
const scryptParallelization = 1;
const derivedKeyLength = 64;
const maximumMemory = 64 * 1024 * 1024;
const passwordHashVersion = "scrypt";

export class InvalidPasswordHashError extends Error {
  constructor() {
    super("Stored password hash has an unsupported format.");
    this.name = "InvalidPasswordHashError";
  }
}

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      derivedKeyLength,
      {
        N: scryptCost,
        r: scryptBlockSize,
        p: scryptParallelization,
        maxmem: maximumMemory,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      },
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 12 || password.length > 128) {
    throw new RangeError("Password length must be between 12 and 128 characters.");
  }

  const salt = randomBytes(16);
  const derivedKey = await deriveKey(password, salt);

  return [
    passwordHashVersion,
    scryptCost,
    scryptBlockSize,
    scryptParallelization,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [version, cost, blockSize, parallelization, encodedSalt, encodedKey, ...extra] =
    encodedHash.split("$");

  if (
    version !== passwordHashVersion ||
    cost !== String(scryptCost) ||
    blockSize !== String(scryptBlockSize) ||
    parallelization !== String(scryptParallelization) ||
    !encodedSalt ||
    !encodedKey ||
    extra.length > 0
  ) {
    throw new InvalidPasswordHashError();
  }

  const salt = Buffer.from(encodedSalt, "base64url");
  const expectedKey = Buffer.from(encodedKey, "base64url");
  if (salt.length !== 16 || expectedKey.length !== derivedKeyLength) {
    throw new InvalidPasswordHashError();
  }

  const actualKey = await deriveKey(password, salt);
  return timingSafeEqual(expectedKey, actualKey);
}
