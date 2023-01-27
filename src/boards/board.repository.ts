import { Injectable } from '@nestjs/common';
import { Board } from './board.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './boards-status.enum';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BoardRepository extends Repository<Board> {}
