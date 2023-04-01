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

    const allUser = await this.usersRepository.findTopTenUsers();
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
  async plusMoney(@MessageBody() body, @ConnectedSocket() socket: Socket) {
    await this.usersRepository.plusMoney(body.id, body.money);

    // 1. 자기 자신의 mony를 증가
    const user = await this.usersRepository.findUserByIdWithoutPassword(
      body.id,
    );
    socket.emit('current_user', user);

    // 2. 모든 유저들에게 money가 update된 모든 유저들을 보내준다.
    const allUser = await this.usersRepository.findTopTenUsers();
    this.server.emit('update_users', allUser);
  }
}
