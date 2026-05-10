import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import * as bcrypt from "bcryptjs";

type UserRow = {
  id: number;
  username: string;
  password: string;
  created_at?: Date;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject("POSTGRES_POOL")
    private readonly sql: NeonQueryFunction<false, false>,
    private readonly jwtService: JwtService
  ) {}

  async registerUser(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword});
    `;
  }

  async validateUser(
    username: string,
    password: string
  ): Promise<Omit<UserRow, "password"> | null> {
    const rows = await this.sql<UserRow[]>`
      SELECT * FROM users WHERE username = ${username};
    `;
    const user = rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _pw, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async login(username: string, password: string) {
    try {
      const user = await this.validateUser(username, password);

      if (user) {
        const payload = { username: user.username, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

      throw new HttpException(
        { message: "Invalid credentials", statusCode: HttpStatus.UNAUTHORIZED },
        HttpStatus.UNAUTHORIZED
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Login Error:", error);
      throw new HttpException(
        {
          message: "An unexpected error occurred",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createUserTable(): Promise<void> {
    await this.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  }
}
