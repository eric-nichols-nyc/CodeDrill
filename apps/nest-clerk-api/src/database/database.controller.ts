import { Controller } from "@nestjs/common";
import { Public } from "../auth/public.decorator";

@Public()
@Controller("database")
export class DatabaseController {}
