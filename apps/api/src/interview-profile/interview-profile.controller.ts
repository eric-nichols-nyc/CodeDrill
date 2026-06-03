import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { GenerateProfileDto, SaveProfileDto, UpdateProfileDto } from "./dto/profile-payload.dto";
import {
  ProblemsUserGuard,
  type RequestWithUserId,
} from "../problem-workspace-code/guards/problems-user.guard";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewProfileGenerateService } from "./interview-profile-generate.service";
// biome-ignore lint/style/useImportType: Nest uses emitted constructor param metadata
import { InterviewProfileService } from "./interview-profile.service";

/**
 * Profile System — resume text → structured profile → persistence.
 *
 * Access: Clerk Bearer JWT (resolved by `ProblemsUserGuard`).
 */
@Controller("interview/profiles")
@UseGuards(ProblemsUserGuard)
export class InterviewProfileController {
  private readonly profileService: InterviewProfileService;
  private readonly generateService: InterviewProfileGenerateService;

  constructor(
    profileService: InterviewProfileService,
    generateService: InterviewProfileGenerateService
  ) {
    this.profileService = profileService;
    this.generateService = generateService;
  }

  /** AI extraction only — does not persist. */
  @Post("generate")
  @HttpCode(200)
  generate(@Body() body: GenerateProfileDto) {
    return this.generateService.generateFromResumeText(body.resumeText);
  }

  @Post()
  @HttpCode(201)
  async save(@Body() body: SaveProfileDto, @Req() request: RequestWithUserId) {
    const { resumeText, ...profile } = body;
    return this.profileService.saveForUser(
      request.userId!,
      resumeText,
      profile
    );
  }

  @Get("me")
  getLatest(@Req() request: RequestWithUserId) {
    return this.profileService.getLatestForUser(request.userId!);
  }

  @Get(":profileId")
  getOne(
    @Param("profileId", ParseUUIDPipe) profileId: string,
    @Req() request: RequestWithUserId
  ) {
    return this.profileService.getByIdForUser(request.userId!, profileId);
  }

  @Patch(":profileId")
  update(
    @Param("profileId", ParseUUIDPipe) profileId: string,
    @Body() body: UpdateProfileDto,
    @Req() request: RequestWithUserId
  ) {
    return this.profileService.updateForUser(
      request.userId!,
      profileId,
      body
    );
  }
}
