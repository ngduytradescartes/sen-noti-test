import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
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
export class EventsGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  constructor(
    private readonly eventsService: EventsService, // private x = 1,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(socket: Socket) {
    console.log('have new connection!');
    this.eventsService.addEventListeners(socket);
  }

  async handleDisconnect() {
    console.log('sockets.disconnect: ');
    this.eventsService.removeEventListeners();
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    socket.join(socket.handshake.query.name);
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
