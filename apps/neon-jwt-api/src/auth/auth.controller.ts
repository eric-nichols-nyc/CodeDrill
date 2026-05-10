import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** One-shot helper: creates the `users` table in Neon (same SQL as the upstream starter README). */
  @Post("create-table")
  async createTable() {
    await this.authService.createUserTable();
    return { message: "Users table created successfully" };
  }

  @Post("register")
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUser: CreateUserDto) {
    await this.authService.registerUser(createUser.username, createUser.password);
    return { message: "User registered successfully" };
  }

  @Post("login")
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() userDetails: LoginUserDto) {
    return this.authService.login(userDetails.username, userDetails.password);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile() {
    return { message: "This is a protected route" };
  }
}
