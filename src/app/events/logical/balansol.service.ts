import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { IdlAccounts } from '@project-serum/anchor/dist/cjs/program/namespace/types';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';

import { SolanaConfig } from 'src/config';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';

@Injectable()
export class BalansolService {
  private provider: AnchorProvider;
  program: Program;
  private listeners: number[];
  @InjectModel(Notification.name)
  private notificationModel: Model<NotificationDocument>;
  private readonly logger = new Logger(BalansolService.name);

  constructor(private configService: ConfigService) {
    const { balansolAddress, endpoint } =
      this.configService.get<SolanaConfig>('solana');
    this.provider = new AnchorProvider(
      new web3.Connection(endpoint),
      {} as any,
      {},
    );
    this.program = new Program(IDL, balansolAddress, this.provider);
  }

  addEventListeners = (socket: Socket) => {
    this.program.idl.events?.forEach(({ name }) => {
      const id = this.program.addEventListener(name, (event) => {
        socket.emit('balansol', { name, content: event });
      });
      this.listeners.push(id);
    });
    this.logger.log("Add Balansol's event listeners successfully");
  };

  removeEventListeners = () => {
    this.listeners.forEach((event) => {
      this.program.removeEventListener(event);
    });
    this.logger.log("Remove Balansol's event listeners successfully");
  };
}

export type PoolData = IdlAccounts<BalancerAmm>['pool'];

export type BalancerAmm = {
  version: '0.1.0';
  name: 'balancer_amm';
  instructions: [];
  accounts: [
    {
      name: 'pool';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'fee';
            type: 'u64';
          },
          {
            name: 'taxFee';
            type: 'u64';
          },
          {
            name: 'state';
            type: {
              defined: 'PoolState';
            };
          },
          {
            name: 'mintLpt';
            type: 'publicKey';
          },
          {
            name: 'taxMan';
            type: 'publicKey';
          },
          {
            name: 'mints';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'actions';
            type: {
              vec: {
                defined: 'MintActionState';
              };
            };
          },
          {
            name: 'treasuries';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'reserves';
            type: {
              vec: 'u64';
            };
          },
          {
            name: 'weights';
            type: {
              vec: 'u64';
            };
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'PoolState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Uninitialized';
          },
          {
            name: 'Initialized';
          },
          {
            name: 'Frozen';
          },
          {
            name: 'Deleted';
          },
        ];
      };
    },
    {
      name: 'MintActionState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Active';
          },
          {
            name: 'BidOnly';
          },
          {
            name: 'AskOnly';
          },
          {
            name: 'Paused';
          },
        ];
      };
    },
  ];
  errors: [];
};

export const IDL: BalancerAmm = {
  version: '0.1.0',
  name: 'balancer_amm',
  instructions: [],
  accounts: [
    {
      name: 'pool',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'fee',
            type: 'u64',
          },
          {
            name: 'taxFee',
            type: 'u64',
          },
          {
            name: 'state',
            type: {
              defined: 'PoolState',
            },
          },
          {
            name: 'mintLpt',
            type: 'publicKey',
          },
          {
            name: 'taxMan',
            type: 'publicKey',
          },
          {
            name: 'mints',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'actions',
            type: {
              vec: {
                defined: 'MintActionState',
              },
            },
          },
          {
            name: 'treasuries',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'reserves',
            type: {
              vec: 'u64',
            },
          },
          {
            name: 'weights',
            type: {
              vec: 'u64',
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'PoolState',
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
          {
            name: 'Deleted',
          },
        ],
      },
    },
    {
      name: 'MintActionState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Active',
          },
          {
            name: 'BidOnly',
          },
          {
            name: 'AskOnly',
          },
          {
            name: 'Paused',
          },
        ],
      },
    },
  ],
  errors: [],
};
