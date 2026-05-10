import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("table")
  async getTable() {
    return this.appService.getPlayingTable();
  }

  @Post("create-table")
  async createTable() {
    await this.appService.createPlayingTable();
    return { message: "Table created successfully" };
  }

  @Post("add-data")
  async addData(@Body() body: { name: string; description: string }) {
    await this.appService.insertPlayingRow(body.name, body.description);
    return { message: "Data inserted successfully" };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
