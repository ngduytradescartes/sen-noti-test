import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Socket } from 'socket.io';

import { SolanaConfig } from 'src/config';

@Injectable()
export class FarmV2Service {
  private provider: AnchorProvider;
  program: Program;
  private listeners: number[];
  private readonly logger = new Logger(FarmV2Service.name);

  constructor(private configService: ConfigService) {
    const { farmingV2Address, endpoint } =
      this.configService.get<SolanaConfig>('solana');
    this.provider = new AnchorProvider(
      new web3.Connection(endpoint),
      {} as any,
      {},
    );
    this.program = new Program(FarmV2IDL, farmingV2Address, this.provider);
    this.listeners = [];
  }

  addEventListeners = (socket: Socket) => {
    this.program.idl.events?.forEach(({ name }) => {
      const id = this.program.addEventListener(name, (event) => {
        socket.emit('farming_v2', { name, content: event });
      });
      this.listeners.push(id);
    });
    this.logger.log("Add FarmV2's event listeners successfully");
  };

  removeEventListeners = () => {
    this.listeners.forEach((event) => {
      this.program.removeEventListener(event);
    });
    this.logger.log("Remove FarmV2's event listeners successfully");
  };
}

export const FarmV2IDL: any = {
  version: '0.1.0',
  name: 'sen_farming_v2',
  instructions: [
    {
      name: 'initializeFarm',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farmTreasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'inputMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'moMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'moTreasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'moAmount',
          type: 'u64',
        },
        {
          name: 'startDate',
          type: 'i64',
        },
        {
          name: 'endDate',
          type: 'i64',
        },
      ],
    },
    {
      name: 'pushFarmRewardMint',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rewardMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'srcRewardTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'farmRewardMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rewardTreasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rewardTreasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'totalRewards',
          type: 'u64',
        },
      ],
    },
    {
      name: 'pushFarmBoostingCollection',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'farmBoostingCollection',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'boostingCollection',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'boostingCoefficient',
          type: 'u64',
        },
      ],
    },
    {
      name: 'initializeDebt',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'inputMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debt',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'deposit',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'srcInputTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'inputMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debt',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'debtTreasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debtMintTreasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'inAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'withdraw',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'dstInputTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'inputMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debt',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'debtTreasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debtMintTreasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'inAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'lock',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'farmBoostingCollection',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'srcNftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nft',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'metadata',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debt',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'debtTreasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debtNftTreasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'unlock',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'farmBoostingCollection',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'dstNftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nft',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'metadata',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debt',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'debtTreasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debtNftTreasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'stake',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'debt',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'unstake',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'farmTreasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debt',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'claim',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'farmTreasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'debt',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'dstMoTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'moTreasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'moMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'convertAllRewards',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'farmTreasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'srcMoTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'moTreasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'moMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'numRewardMints',
          type: 'u64',
        },
        {
          name: 'moAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'transferOwnership',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'farm',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'newOwner',
          type: 'publicKey',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'Debt',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'farm',
            type: 'publicKey',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'shares',
            type: 'u64',
          },
          {
            name: 'debtAmount',
            type: 'u128',
          },
          {
            name: 'pendingRewards',
            type: 'u64',
          },
          {
            name: 'mintedAmount',
            type: 'u64',
          },
          {
            name: 'leverage',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'FarmBoostingCollection',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'farm',
            type: 'publicKey',
          },
          {
            name: 'boostingCollection',
            type: 'publicKey',
          },
          {
            name: 'boostingCoefficient',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'FarmRewardMint',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'farm',
            type: 'publicKey',
          },
          {
            name: 'rewardMint',
            type: 'publicKey',
          },
          {
            name: 'totalRewards',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'Farm',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'inputMint',
            type: 'publicKey',
          },
          {
            name: 'moMint',
            type: 'publicKey',
          },
          {
            name: 'startDate',
            type: 'i64',
          },
          {
            name: 'endDate',
            type: 'i64',
          },
          {
            name: 'totalShares',
            type: 'u64',
          },
          {
            name: 'totalRewards',
            type: 'u64',
          },
          {
            name: 'compensation',
            type: 'u128',
          },
          {
            name: 'state',
            type: {
              defined: 'FarmState',
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'FarmState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Uninitialized',
          },
          {
            name: 'Initialized',
          },
          {
            name: 'Frozen',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'ClaimEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'debt',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'rewards',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'ConvertAllRewardsEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'ConvertSingleRewardEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farmRewardMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'rewardMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'rewards',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'DepositEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'debt',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'inAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'outAmount',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'InitializeDebtEvent',
      fields: [
        {
          name: 'debt',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'shares',
          type: 'u64',
          index: false,
        },
        {
          name: 'debtAmount',
          type: 'u128',
          index: false,
        },
        {
          name: 'pendingRewards',
          type: 'u64',
          index: false,
        },
        {
          name: 'leverage',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'InitializeFarmEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'inputMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'moMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'startDate',
          type: 'i64',
          index: false,
        },
        {
          name: 'endDate',
          type: 'i64',
          index: false,
        },
        {
          name: 'totalShares',
          type: 'u64',
          index: false,
        },
        {
          name: 'compensation',
          type: 'u128',
          index: false,
        },
        {
          name: 'state',
          type: {
            defined: 'FarmState',
          },
          index: false,
        },
      ],
    },
    {
      name: 'LockEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'debt',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'collection',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nft',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'leverage',
          type: 'u64',
          index: false,
        },
        {
          name: 'boostingCoefficient',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'PushFarmBoostingCollectionEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farmBoostingCollection',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'boostingCollection',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'boostingCoefficient',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'PushFarmRewardMintEvent',
      fields: [
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farmRewardMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'rewardMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'totalRewards',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'StakeEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'debt',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'shares',
          type: 'u64',
          index: false,
        },
        {
          name: 'debtAmount',
          type: 'u128',
          index: false,
        },
      ],
    },
    {
      name: 'TransferOwnerShipEvent',
      fields: [
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'UnLockEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'debt',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'collection',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nft',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'leverage',
          type: 'u64',
          index: false,
        },
        {
          name: 'boostingCoefficient',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'UnstakeEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'debt',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'prevShares',
          type: 'u64',
          index: false,
        },
        {
          name: 'prevDebtAmount',
          type: 'u128',
          index: false,
        },
        {
          name: 'rewards',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'WithdrawEvent',
      fields: [
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'farm',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'debt',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'inAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'outAmount',
          type: 'u64',
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'Overflow',
      msg: 'Operation overflowed',
    },
    {
      code: 6001,
      name: 'NoPermission',
      msg: 'No permission',
    },
    {
      code: 6002,
      name: 'NoBump',
      msg: 'Cannot derive the program address',
    },
    {
      code: 6003,
      name: 'EmptyRewards',
      msg: 'Cannot set empty rewards',
    },
    {
      code: 6004,
      name: 'ZeroCoefficients',
      msg: 'Cannot set zero to coefficients',
    },
    {
      code: 6005,
      name: 'EndBeforeStart',
      msg: 'Cannot end before start',
    },
    {
      code: 6006,
      name: 'InvalidDatetime',
      msg: 'Invalid Datetime',
    },
    {
      code: 6007,
      name: 'MinimumSupply',
      msg: 'Highly recommend 1_000_000_000_000_000_000 to minimum supply',
    },
    {
      code: 6008,
      name: 'InvalidState',
      msg: 'Invalid State',
    },
    {
      code: 6009,
      name: 'InvalidCollection',
      msg: 'Invalid NFT Collection',
    },
    {
      code: 6010,
      name: 'MustBeEmptyDebt',
      msg: 'Must be empty debt',
    },
    {
      code: 6011,
      name: 'DuplicateRewardMint',
      msg: 'Duplicate reward mint',
    },
    {
      code: 6012,
      name: 'InsufficientBalance',
      msg: 'Insufficient balance',
    },
  ],
};
