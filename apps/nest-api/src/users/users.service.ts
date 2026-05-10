import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { createUserSchema, type UserDto } from '@repo/schemas';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [
    {
      id: 1,
      name: 'Leanne Graham',
      email: 'Sincere@april.biz',
      role: 'INTERN',
    },
    {
      id: 2,
      name: 'Ervin Howell',
      email: 'Shanna@melissa.tv',
      role: 'INTERN',
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      email: 'Nathan@yesenia.net',
      role: 'ENGINEER',
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      email: 'Julianne.OConner@kory.org',
      role: 'ENGINEER',
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      email: 'Lucio_Hettinger@annie.ca',
      role: 'ADMIN',
    },
  ];

  findAll(): UserDto[] {
    return this.users;
  }

  create(payload: unknown): UserDto {
    const parsed = createUserSchema.safeParse(payload);
    if (!parsed.success) {
      const detail = parsed.error.issues
        .map(
          (issue) =>
            `${issue.path.length > 0 ? issue.path.join('.') : 'body'}: ${issue.message}`,
        )
        .join('; ');
      throw new BadRequestException(detail || 'Invalid request body');
    }
    const dto = parsed.data;
    const emailNormalized = dto.email.toLowerCase();
    const duplicate = this.users.some(
      (u) => u.email.toLowerCase() === emailNormalized,
    );
    if (duplicate) {
      throw new ConflictException('A user with this email already exists');
    }
    const nextId =
      this.users.length === 0
        ? 1
        : Math.max(...this.users.map((u) => u.id)) + 1;
    const user: UserDto = {
      id: nextId,
      name: dto.name,
      email: dto.email,
      role: dto.role,
    };
    this.users.push(user);
    return user;
  }
}
