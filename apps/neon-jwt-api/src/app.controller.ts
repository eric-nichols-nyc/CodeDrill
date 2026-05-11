import { Body, Controller, Get, Post } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AllowAnonymous()
  @Get("table")
  async getTable() {
    return this.appService.getPlayingTable();
  }

  @AllowAnonymous()
  @Post("create-table")
  async createTable() {
    await this.appService.createPlayingTable();
    return { message: "Table created successfully" };
  }

  @AllowAnonymous()
  @Post("add-data")
  async addData(@Body() body: { name: string; description: string }) {
    await this.appService.insertPlayingRow(body.name, body.description);
    return { message: "Data inserted successfully" };
  }

  @AllowAnonymous()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
