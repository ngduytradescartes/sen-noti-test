import axios from 'axios';
import { utils } from '@senswap/sen-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

import SUPPLEMENTARY, { SEN } from './supplementary';
import { SenJS } from '../senJS/client';
import { SolanaConfig } from 'src/config';

@Injectable()
export class TokenProvider {
  private tokenList: TokenInfo[] = [];

  private getChainID() {
    const { chainId } = this.configService.get<SolanaConfig>('solana');
    return chainId;
  }
  private getCluster() {
    const { cluster } = this.configService.get<SolanaConfig>('solana');
    return cluster;
  }
  constructor(private configService: ConfigService, private senjs: SenJS) {}

  private _init = async (): Promise<TokenInfo[]> => {
    if (this.tokenList.length) return this.tokenList;
    const tokenList = (await new TokenListProvider().resolve())
      .filterByChainId(this.getChainID())
      .getList();
    if (this.getCluster() === 'devnet') {
      const dataClone: TokenInfo[] = [...SUPPLEMENTARY];
      this.tokenList = dataClone.concat(tokenList);
    } else {
      const senClone: TokenInfo[] = [...SEN];
      this.tokenList = senClone.concat(tokenList);
    }
    return this.tokenList;
  };

  findByAddress = async (addr: string): Promise<TokenInfo | undefined> => {
    const tl = await this._init();
    return tl.find(({ address }) => address === addr);
  };

  getPrice = async (mintAddress: string): Promise<number> => {
    // Check price Cgk
    const price = await this.getPriceCgk(mintAddress);
    if (price !== 0) return price;

    // Check price Jup
    return this.getJupiterPrice(mintAddress);
  };

  private getPriceCgk = async (mintAddress: string): Promise<number> => {
    try {
      const token = await this.findByAddress(mintAddress);
      const ticket = token?.extensions?.coingeckoId;
      if (!ticket) return 0;

      const CGKTokenInfo = await utils.parseCGK(ticket);
      const price = CGKTokenInfo.price;

      return price;
    } catch {
      return 0;
    }
  };

  public getJupiterPrice = async (mintAddress: string) => {
    try {
      const USDC_PRICE = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
      const priceUrl = `https://quote-api.jup.ag/v1/quote?inputMint=${USDC_PRICE}&outputMint=${mintAddress}&amount=1000000&slippage=1`;
      const routes = await axios.get(priceUrl).then((res) => res.data.data);

      const token = await this.findByAddress(mintAddress);
      let decimals = token?.decimals;
      if (!decimals) {
        const mintData = await this.senjs.getSplt().getMintData(mintAddress);
        decimals = mintData.decimals;
      }
      const bestOutput = await utils.undecimalize(
        BigInt(routes[0].outAmount),
        decimals,
      );
      return 1 / Number(bestOutput);
    } catch {
      return 0;
    }
  };
}
