import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty() // 비어있는 값 허용 안함
  title: string;

  @IsNotEmpty()
  description: string;
}
