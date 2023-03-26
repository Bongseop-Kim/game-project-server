import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersRepository } from 'src/users/users.repository';

@WebSocketGateway({ cors: true })
export class RankingGateway {
  private logger = new Logger('ranking');

  constructor(private readonly usersRepository: UsersRepository) {}

  handleConnection(@ConnectedSocket() socket: Socket) {
    //socket 접속시
    this.logger.log(`connected: ${socket.id} ${socket.nsp.name}`);
  }
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    //socket 접속 취소시
    this.logger.log(`disconnected: ${socket.id} ${socket.nsp.name}`);
  }

  afterInit() {
    // this.logger.log('init');
  }

  @SubscribeMessage('user_connected')
  async userConnect(
    @MessageBody() name: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('new_chat', name);
    return name;
  }
}
