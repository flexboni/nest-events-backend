import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/auth/input/create.user.dto';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Password are not identical']);
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) {
      throw new BadRequestException(['username or email is already taken']);
    }

    const user = new User();
    user.username = createUserDto.username;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenFromUser(user),
    };
  }
}
