import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Farming, SPLT, Swap } from '@senswap/sen-js';
import { SolanaConfig } from 'src/config';

@Injectable()
export class SenJS {
  constructor(private configService: ConfigService) {}

  getSwap() {
    const { swapAddress, spltAddress, splataAddress, endpoint } =
      this.configService.get<SolanaConfig>('solana');
    return new Swap(swapAddress, spltAddress, splataAddress, endpoint);
  }

  getSplt() {
    const { spltAddress, splataAddress, endpoint } =
      this.configService.get<SolanaConfig>('solana');
    return new SPLT(spltAddress, splataAddress, endpoint);
  }

  getFarm() {
    const { farmingAddress, spltAddress, splataAddress, endpoint } =
      this.configService.get<SolanaConfig>('solana');
    return new Farming(farmingAddress, spltAddress, splataAddress, endpoint);
  }
}
