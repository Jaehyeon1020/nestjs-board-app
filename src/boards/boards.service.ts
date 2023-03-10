import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

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

  async getUserBoards(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany(); // query문에 맞는 모든 entity 불러옴
    return boards;
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
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

  async deleteBoardById(id: number, user: User): Promise<void> {
    const matching = user.boards.filter((board) => board.id === id); // 이 유저가 주어진 id에 해당하는 게시글을 소유하고 있는지 확인

    if (!matching) {
      throw new NotFoundException('게시물 삭제 권한이 없습니다.');
    }

    const result = await this.boardRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const found = await this.getBoardById(id);

    found.status = status;
    this.boardRepository.save(found);

    return found;
  }
}
