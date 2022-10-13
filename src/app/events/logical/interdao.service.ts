import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {
  Program,
  AnchorProvider,
  web3,
  IdlAccounts,
} from '@project-serum/anchor';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';

import { NotificationService } from 'src/app/events/database/notification/notification.service';
import { SolanaConfig } from 'src/config';
import { Listener } from 'src/const';
import { Dapp, DappDocument } from 'src/schemas/dapp.schema';
import {
  NotificationDocument,
  Notification,
} from 'src/schemas/notification.schema';
import { ContentTemplateService } from '../database/content-template/content-template.service';
import { DappService } from '../database/dapp/dapp.service';
import { NotificationDto } from '../database/notification/notification.dto';
import { InterDao, InterDaoIDL } from './idls/interdao';

@Injectable()
export class InterdaoService {
  private provider: AnchorProvider;
  program: Program;
  private listeners: Listener[];
  private readonly logger = new Logger(InterdaoService.name);

  constructor(
    private configService: ConfigService,
    private notificationService: NotificationService,
    private dappService: DappService,
    private contentTemplateService: ContentTemplateService,
  ) {
    const { interdaoAddress, endpoint } =
      this.configService.get<SolanaConfig>('solana');
    this.provider = new AnchorProvider(
      new web3.Connection(endpoint),
      {} as any,
      {},
    );
    this.program = new Program(InterDaoIDL, interdaoAddress, this.provider);
    this.listeners = [];
  }

  private getDaoData = async (daoAddress: string): Promise<DaoData> => {
    return this.program.account.dao.fetch(daoAddress) as any;
  };

  private getProposalData = async (
    proposalAddress: string,
  ): Promise<ProposalData> => {
    return this.program.account.proposal.fetch(proposalAddress) as any;
  };

  private getExtraInfo = async (address: string, type: ExtraInfoType) => {
    switch (type) {
      case 'proposal':
        return this.getProposalData(address);
      case 'dao':
        return this.getDaoData(address);
      default:
        return;
    }
  };

  addEventListeners = (socket: Socket) => {
    this.program.idl.events?.forEach(async ({ name }) => {
      const existedEvent = this.listeners.find((val) => {
        val.name === name;
      });
      if (!existedEvent) {
        const id = this.program.addEventListener(name, async (event) => {
          const dapp = await this.dappService.getDapp({
            address:
              this.configService.get<SolanaConfig>('solana').interdaoAddress,
          });

          const contentTemplate =
            await this.contentTemplateService.getContentTemplate({
              eventName: name,
              dappId: dapp._id,
            });
          console.log('event', event);
          const extraInfo = await this.getExtraInfo(
            event[contentTemplate.extraField].toBase58(),
            contentTemplate.extraField as ExtraInfoType,
          );

          console.log('extraInfo: ', extraInfo);
          const content = `${contentTemplate?.subject} ${contentTemplate?.conjunction} ${contentTemplate?.object}`;
          const notification: NotificationDto = {
            dappId: dapp._id,
            name: dapp.name,
            content,
            seen: false,
            time: new Date(),
          };
          const savedNotification =
            await this.notificationService.newNotification(notification);
          console.log('savedNotification: ', savedNotification, dapp.address);
          socket
            .to(dapp.address)
            .emit('notification', { data: savedNotification });
        });
        this.listeners.push({ id, name });
      }
    });
    this.logger.log("Add Interdao's event listeners successfully");
  };

  removeEventListeners = () => {
    console.log('this.listeners: ', this.listeners);
    this.listeners?.forEach(async (event) => {
      await this.program.removeEventListener(event.id);
    });
    this.listeners = [];
    this.logger.log("Remove Interdao's event listeners successfully");
  };
}

export type DaoData = IdlAccounts<InterDao>['dao'];
export type ProposalData = IdlAccounts<InterDao>['proposal'];
export type ExtraInfoType = 'dao' | 'proposal';
