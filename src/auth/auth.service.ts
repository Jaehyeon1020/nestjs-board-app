import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(authCredential: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredential;
    const salt = await bcrypt.genSalt();
    const hashedPw = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({ username, password: hashedPw });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('중복되는 username이 존재합니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(
    authCredential: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredential;
    const user = this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, (await user).password))) {
      const payload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('로그인 실패');
    }
  }
}
