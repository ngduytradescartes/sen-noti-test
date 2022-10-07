import {
  AccountInfo,
  ConfirmedSignatureInfo,
  ConfirmedSignaturesForAddress2Options,
  Connection,
  GetProgramAccountsConfig,
  ParsedConfirmedTransaction,
  PublicKey,
} from '@solana/web3.js';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SolanaConfig } from 'src/config';

const DEFAULT_LIMIT = 200;

export interface ISolana {
  fetchTransactions(
    programId: string,
    secondFrom: number,
    secondTo: number,
    lastSignature?: string,
  ): Promise<Array<ParsedConfirmedTransaction>>;

  fetchAccounts(
    programId: string,
    configOrCommitment: GetProgramAccountsConfig,
  ): Promise<Array<{ pubkey: PublicKey; account: AccountInfo<Buffer> }>>;
}

@Injectable()
export class Solana implements ISolana {
  private readonly logger = new Logger(Solana.name);
  private conn: Connection;

  constructor(private configService: ConfigService) {
    const solanaConfig = this.configService.get<SolanaConfig>('solana');
    this.conn = new Connection(solanaConfig.endpoint);
  }

  //Search for all signatures from last Signature and earlier
  //So: If new collection (to now) -> last Signature = null
  private async fetchSignatures(
    address: PublicKey,
    lastSignature?: string,
    limit?: number,
  ): Promise<Array<ConfirmedSignatureInfo>> {
    if (limit > DEFAULT_LIMIT || limit == undefined) limit = DEFAULT_LIMIT;
    const options: ConfirmedSignaturesForAddress2Options = {
      limit: limit,
      before: lastSignature,
    };
    return this.conn.getConfirmedSignaturesForAddress2(address, options);
  }

  async fetchTransactions(
    programId: string,
    secondFrom: number,
    secondTo: number,
  ): Promise<ParsedConfirmedTransaction[]> {
    secondFrom = Math.floor(secondFrom);
    secondTo = Math.floor(secondTo);

    const programPublicKey = new PublicKey(programId);
    let lastSignature;
    let transactions: Array<ParsedConfirmedTransaction> = [];
    let isStop = false;
    while (!isStop) {
      const confirmedSignatureInfos = await this.fetchSignatures(
        programPublicKey,
        lastSignature,
      );
      if (!confirmedSignatureInfos?.length) break;

      const signatures: Array<string> = [];
      for (const info of confirmedSignatureInfos) {
        const blockTime = info.blockTime;
        if (blockTime > secondTo) continue;
        if (blockTime < secondFrom) {
          isStop = true;
          break;
        }
        lastSignature = info.signature;
        signatures.push(lastSignature);
      }
      this.logger.log(`size of signatures: ${signatures.length}`);
      const confirmedTransactions =
        await this.conn.getParsedConfirmedTransactions(signatures);
      transactions = transactions.concat(confirmedTransactions);
    }
    return transactions;
  }

  async fetchAccounts(
    programId: string,
    configOrCommitment: GetProgramAccountsConfig,
  ): Promise<Array<{ pubkey: PublicKey; account: AccountInfo<Buffer> }>> {
    const programKey = new PublicKey(programId);
    return this.conn.getProgramAccounts(programKey, configOrCommitment);
  }
}
