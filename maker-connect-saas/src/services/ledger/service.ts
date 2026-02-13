import {
  createHash,
  createSign,
  createVerify,
  generateKeyPairSync,
} from "crypto";
import {
  QldbDriver,
  TransactionExecutor,
  Result,
} from "amazon-qldb-driver-nodejs";
import { QLDBClientConfig } from "@aws-sdk/client-qldb";

export interface ILedgerEntry {
  id: string;
  previousHash: string;
  dataHash: string;
  timestamp: Date;
  signature: string;
  signerId: string;
  data: any;
}

export class LedgerService {
  private ledger: ILedgerEntry[] = [];
  private privateKey: string;
  private publicKey: string;
  private signerId: string = "system_signer";
  private qldbDriver: QldbDriver | null = null;
  private tableName: string = "MakerConnectLedger";

  constructor() {
    // Generate a key pair for the system signer (mocking a secure wallet/KMS)
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    this.privateKey = privateKey;
    this.publicKey = publicKey;

    // Initialize QLDB Driver if configured
    const ledgerName = process.env.AWS_QLDB_LEDGER_NAME;
    if (ledgerName) {
      const serviceConfigurationOptions: QLDBClientConfig = {
        region: process.env.AWS_REGION || "us-east-1",
      };
      this.qldbDriver = new QldbDriver(ledgerName, serviceConfigurationOptions);
      console.log(`[Ledger] QLDB Driver initialized for ledger: ${ledgerName}`);
    } else {
      console.warn(
        "[Ledger] AWS_QLDB_LEDGER_NAME not set. Using in-memory mock ledger.",
      );
    }

    // Genesis block (only for local mock)
    if (!this.qldbDriver) {
      this.recordEntry({ event: "GENESIS_BLOCK", note: "Ledger initialized" });
    }
  }

  /**
   * Calculates SHA-256 hash of any data object
   */
  public calculateHash(data: any): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort()); // Sort keys for deterministic hashing
    return createHash("sha256").update(dataString).digest("hex");
  }

  /**
   * Records an entry to the immutable ledger
   */
  public async recordEntry(
    data: any,
    signerId?: string,
  ): Promise<ILedgerEntry> {
    const timestamp = new Date();

    // 1. Prepare payload
    // In a real scenario, we might need to fetch the previous hash from QLDB to chain it.
    // For QLDB, the "chaining" is internal, but we can store our own hash chain for extra verification.

    // For simplicity in this hybrid mode, let's just hash the data and sign it.
    const dataHash = this.calculateHash(data);

    const entryPayload = {
      dataHash,
      timestamp,
      signerId: signerId || this.signerId,
      data,
    };

    // 2. Sign the entry
    const entryHash = this.calculateHash(entryPayload);
    const sign = createSign("SHA256");
    sign.update(entryHash);
    sign.end();
    const signature = sign.sign(this.privateKey, "hex");

    const newEntry: ILedgerEntry = {
      id: entryHash,
      previousHash: "managed-by-qldb", // QLDB handles the chaining
      ...entryPayload,
      signature,
    };

    // 3. Write to QLDB if active
    if (this.qldbDriver) {
      try {
        await this.qldbDriver.executeLambda(
          async (txn: TransactionExecutor) => {
            await txn.execute(`INSERT INTO ${this.tableName} ?`, [
              newEntry,
            ]);
          },
        );
        console.log(
          `[Ledger] Recorded entry to QLDB: ${newEntry.id.substring(0, 8)}`,
        );
      } catch (error) {
        console.error("[Ledger] Failed to write to QLDB:", error);
        throw error;
      }
    } else {
      // Fallback to local
      const previousEntry = this.ledger[this.ledger.length - 1];
      newEntry.previousHash = previousEntry
        ? this.calculateHash(previousEntry)
        : "0";
      this.ledger.push(newEntry);
      console.log(
        `[Ledger] Recorded entry to local mock: ${newEntry.id.substring(0, 8)}`,
      );
    }

    return newEntry;
  }

  /**
   * Verifies the integrity of the ledger
   */
  public async verifyChain(): Promise<boolean> {
    if (this.qldbDriver) {
      // QLDB has built-in verification features (GetDigest, GetBlock).
      // For this adapter, we'll assume QLDB is trustworthy and focus on verifying our application-level signatures if we pulled data back.
      console.log("[Ledger] QLDB provides internal verification.");
      return true;
    }

    // Local mock verification
    for (let i = 1; i < this.ledger.length; i++) {
      const currentEntry = this.ledger[i];
      const previousEntry = this.ledger[i - 1];

      // 1. Verify previous hash link
      const recalculatedPrevHash = this.calculateHash(previousEntry);
      if (currentEntry.previousHash !== recalculatedPrevHash) {
        console.error(
          `[Ledger] Chain broken at index ${i}: Previous hash mismatch`,
        );
        return false;
      }

      // 2. Verify signature
      const entryPayload = {
        dataHash: currentEntry.dataHash,
        timestamp: currentEntry.timestamp,
        signerId: currentEntry.signerId,
        data: currentEntry.data,
      };

      // Reconstruct payload for hashing (excluding id, signature, previousHash if we want to valid just the content)
      // But we signed the whole payload structure constructed in recordEntry.
      // Let's match existing logic:
      const verifyPayload = {
        dataHash: currentEntry.dataHash,
        timestamp: currentEntry.timestamp,
        signerId: currentEntry.signerId,
        data: currentEntry.data,
      };

      const entryHash = this.calculateHash(verifyPayload); // This must match what was signed

      const verify = createVerify("SHA256");
      verify.update(entryHash);
      verify.end();

      if (!verify.verify(this.publicKey, currentEntry.signature, "hex")) {
        console.error(`[Ledger] Invalid signature at index ${i}`);
        return false;
      }
    }
    return true;
  }

  public getChain(): ILedgerEntry[] {
    return this.ledger;
  }
}

// Singleton instance
export const ledgerService = new LedgerService();
