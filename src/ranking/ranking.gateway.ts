import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersRepository } from 'src/users/users.repository';

@WebSocketGateway({ cors: true })
export class RankingGateway {
  @WebSocketServer() server: Server;
  private logger = new Logger('ranking');

  constructor(private readonly usersRepository: UsersRepository) {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    //socket 접속시

    const allUser = await this.usersRepository.findAll();
    this.server.emit('update_users', allUser);
    this.logger.log(`connected: ${socket.id} ${socket.nsp.name}`);
  }
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    //socket 접속 취소시
    this.logger.log(`disconnected: ${socket.id} ${socket.nsp.name}`);
  }

  afterInit() {
    // this.logger.log('init');
  }

  @SubscribeMessage('plusMoney')
  async plusMoney(@MessageBody() array, @ConnectedSocket() socket: Socket) {
    await this.usersRepository.plusMoney(array[0], array[1]);

    const user = await this.usersRepository.findUserByIdWithoutPassword(
      array[0],
    );
    socket.emit('current_user', user);

    const allUser = await this.usersRepository.findAll();
    this.server.emit('update_users', allUser);
  }
}
