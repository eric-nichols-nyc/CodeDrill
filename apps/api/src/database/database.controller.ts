import { Controller } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@AllowAnonymous()
@Controller("database")
export class DatabaseController {}
