import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(authCredential: AuthCredentialDto) {
    const { username, password } = authCredential;
    const user = this.userRepository.create({ username, password });

    await this.userRepository.save(user);
  }
}
