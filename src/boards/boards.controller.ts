import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsService } from './boards.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get('/')
  getAllBoards(@GetUser() user: User) {
    // return this.boardsService.getAllBoards(); // service에서 요청을 처리
    return this.boardsService.getUserBoards(user); // 지금 로그인되어있는 유저의 게시글만 보기
  }

  @Post('/')
  @UsePipes(ValidationPipe) // Handler-level의 유효성 체크 Pipe
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Delete('/:id')
  deletePostById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    this.boardsService.deleteBoardById(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return this.boardsService.updateBoardStatus(id, status);
  }
}
