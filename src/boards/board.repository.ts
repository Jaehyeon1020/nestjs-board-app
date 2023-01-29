import { Injectable } from '@nestjs/common';
import { Board } from './board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardRepository extends Repository<Board> {}
