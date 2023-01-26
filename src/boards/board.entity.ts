import { BoardStatus } from './boards.model';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/* 다음 column들을 가진 Board 테이블이 어플리케이션 실행 시 자동으로 생성됨 */
@Entity() // CREATE TABLE Board
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: BoardStatus;
}
