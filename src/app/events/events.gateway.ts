import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { EventsService } from 'src/app/events/events.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
  constructor(
    private readonly eventsService: EventsService, // private x = 1,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(socket: Socket) {
    this.eventsService.addEventListeners(socket);
  }

  handleDisconnect() {
    this.eventsService.removeEventListeners();
  }

  @SubscribeMessage('events')
  findAll(): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
