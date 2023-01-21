import { BoardsService } from './boards.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Board } from './boards.model';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get('/')
  getAllBoards() {
    return this.boardsService.getAllBoards(); // service에서 요청을 처리
  }

  @Post('/')
  createBoard(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Board {
    return this.boardsService.createBoard(title, description);
  }
}
