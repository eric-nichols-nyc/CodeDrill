import {
  BadGatewayException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, type ValidationError } from "class-validator";
import { ProfilePayloadDto } from "./dto/profile-payload.dto";
import {
  AI_PROFILE_EXTRACT_MODEL,
  AI_PROFILE_EXTRACT_SYSTEM_PROMPT,
  OPENAI_CHAT_COMPLETIONS_URL,
} from "./interview-profile.constants";
import {
  parseModelJsonObject,
  readOpenAiAssistantContent,
  readOpenAiErrorMessage,
} from "../problems/openai-completion.util";

function flattenValidationErrors(
  errors: ValidationError[],
  parent = ""
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const error of errors) {
    const path = parent ? `${parent}.${error.property}` : error.property;

    if (error.constraints) {
      fieldErrors[path] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      Object.assign(fieldErrors, flattenValidationErrors(error.children, path));
    }
  }

  return fieldErrors;
}

@Injectable()
export class InterviewProfileGenerateService {
  async generateFromResumeText(resumeText: string): Promise<ProfilePayloadDto> {
    const trimmed = resumeText.trim();
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return this.stubProfile(trimmed);
    }

    const upstream = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_PROFILE_EXTRACT_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: AI_PROFILE_EXTRACT_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Resume text:\n\n${trimmed}\n\nReturn only the JSON object.`,
          },
        ],
      }),
    });

    const rawText = await upstream.text();
    let completion: unknown;
    try {
      completion = JSON.parse(rawText) as unknown;
    } catch {
      throw new BadGatewayException({
        error: "OpenAI returned non-JSON.",
        detail: rawText.slice(0, 500),
      });
    }

    if (!upstream.ok) {
      throw new BadGatewayException({
        error: readOpenAiErrorMessage(completion, upstream.status),
      });
    }

    const content = readOpenAiAssistantContent(completion);
    if (!content?.trim()) {
      throw new BadGatewayException({
        error: "OpenAI returned an empty profile.",
      });
    }

    let parsedJson: unknown;
    try {
      parsedJson = parseModelJsonObject(content);
    } catch {
      throw new BadGatewayException({
        error: "OpenAI profile JSON could not be parsed.",
        detail: content.slice(0, 500),
      });
    }

    const profile = plainToInstance(ProfilePayloadDto, parsedJson);
    const validationErrors = await validate(profile, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (validationErrors.length > 0) {
      throw new UnprocessableEntityException({
        error: "Model JSON failed validation.",
        fields: flattenValidationErrors(validationErrors),
      });
    }

    return profile;
  }

  /** Dev-friendly fallback when OPENAI_API_KEY is unset on the API. */
  private stubProfile(resumeText: string): ProfilePayloadDto {
    const firstLine =
      resumeText.split("\n").find((line) => line.trim().length > 0)?.trim() ??
      "Candidate";

    return plainToInstance(ProfilePayloadDto, {
      summary: `${firstLine.slice(0, 400)}${firstLine.length > 400 ? "…" : ""} (dev stub — set OPENAI_API_KEY on apps/api for real extraction.)`,
      coreSkills: [],
      projects: [],
      claimsToVerify: [],
      strengthAreas: [],
      potentialGapAreas: [],
    });
  }
}
