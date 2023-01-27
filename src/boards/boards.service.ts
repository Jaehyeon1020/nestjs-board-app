import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { v1 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
  /* 만들어둔 게시판 repo를 service에서 사용할 수 있도록 만들기 */
  constructor(
    @InjectRepository(Board)
    private boardRepository: BoardRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return await this.boardRepository.find();
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title: title,
      description: description,
      status: BoardStatus.PUBLIC,
    });

    await this.boardRepository.save(board);
    return board;
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(
        `ID ${id}에 해당하는 게시글을 찾을 수 없습니다.`,
      ); // NestJS에 미리 정의되어있는 예외
    }
    return found;
  }

  async deleteBoardById(id: number): Promise<void> {
    const result = await this.boardRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        '삭제하려고 하는 게시물과 일치하는 id가 없습니다.',
      );
    }
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const found = await this.getBoardById(id);

    found.status = status;
    this.boardRepository.save(found);

    return found;
  }
}
