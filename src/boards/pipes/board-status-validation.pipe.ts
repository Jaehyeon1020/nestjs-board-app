import { BoardStatus } from './../boards.model';
import { BadRequestException, PipeTransform } from '@nestjs/common';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException('잘못된 상태 정보입니다.');
    }

    return value;
  }

  private isStatusValid(value: any) {
    const index = this.StatusOptions.indexOf(value);

    return index !== -1; // -1이 나오면 false(indexOf() 값 없으면 -1 반환됨)
  }
}
