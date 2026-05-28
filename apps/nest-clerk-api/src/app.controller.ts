import { Controller, Get } from "@nestjs/common";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { AppService } from "./app.service";
import { Public } from "./auth/public.decorator";

@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get("health")
  getHealth() {
    return { status: "ok" };
  }
}
