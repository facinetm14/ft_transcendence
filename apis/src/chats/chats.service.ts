import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/messages.entity';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Message)
    private MessageRepository: Repository<Message>,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const userId = socket.handshake.headers['x-custom-data'];
    const user = await this.usersService.findOne(+userId);
    if (!user) {
      throw new WsException('Invalid user');
    }
    return user;
  }

  async saveMessage(message: MessageDto) {
    const newMessage = {
      ...message,
      author: +message.author,
      receiver: +message.receiver,
    };
    return this.MessageRepository.save(newMessage);
  }

  async findAllMessages() {
    return this.MessageRepository.find();
  }
}
