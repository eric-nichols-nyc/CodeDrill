import {
  BadGatewayException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, type ValidationError } from "class-validator";
import {
  type GenerateJobAnalysisDto,
  JobAnalysisPayloadDto,
} from "./dto/job-analysis-payload.dto";
import {
  AI_JOB_ANALYSIS_MODEL,
  AI_JOB_ANALYSIS_SYSTEM_PROMPT,
  OPENAI_CHAT_COMPLETIONS_URL,
} from "./interview-job-analysis.constants";
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
export class InterviewJobAnalysisGenerateService {
  async generateFromJobDescription(
    input: GenerateJobAnalysisDto
  ): Promise<JobAnalysisPayloadDto> {
    const trimmed = input.jobDescription.trim();
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return this.stubAnalysis(trimmed, input);
    }

    const hints: string[] = [];
    if (input.companyName?.trim()) {
      hints.push(`User-provided company: ${input.companyName.trim()}`);
    }
    if (input.roleTitle?.trim()) {
      hints.push(`User-provided role title: ${input.roleTitle.trim()}`);
    }
    if (input.jobUrl?.trim()) {
      hints.push(`Job URL (context only): ${input.jobUrl.trim()}`);
    }

    const hintBlock =
      hints.length > 0 ? `\n\n${hints.join("\n")}` : "";

    const upstream = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_JOB_ANALYSIS_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: AI_JOB_ANALYSIS_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Job description:\n\n${trimmed}${hintBlock}\n\nReturn only the JSON object.`,
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
        error: "OpenAI returned an empty job analysis.",
      });
    }

    let parsedJson: unknown;
    try {
      parsedJson = parseModelJsonObject(content);
    } catch {
      throw new BadGatewayException({
        error: "OpenAI job analysis JSON could not be parsed.",
        detail: content.slice(0, 500),
      });
    }

    return this.validatePayload(parsedJson);
  }

  private async validatePayload(
    parsedJson: unknown
  ): Promise<JobAnalysisPayloadDto> {
    const payload = plainToInstance(JobAnalysisPayloadDto, parsedJson);
    const validationErrors = await validate(payload, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (validationErrors.length > 0) {
      throw new UnprocessableEntityException({
        error: "Model JSON failed validation.",
        fields: flattenValidationErrors(validationErrors),
      });
    }

    return payload;
  }

  /** Dev-friendly fallback when OPENAI_API_KEY is unset on the API. */
  private stubAnalysis(
    jobDescription: string,
    input: GenerateJobAnalysisDto
  ): JobAnalysisPayloadDto {
    const firstLine =
      jobDescription
        .split("\n")
        .find((line) => line.trim().length > 0)
        ?.trim() ?? "Role";

    const companyName =
      input.companyName?.trim() || "Unknown Company (dev stub)";
    const roleTitle = input.roleTitle?.trim() || firstLine.slice(0, 120);

    return plainToInstance(JobAnalysisPayloadDto, {
      companyName,
      roleTitle,
      roleSummary: `${roleTitle} — dev stub analysis. Set OPENAI_API_KEY on apps/api for real extraction.`,
      requiredSkills: [],
      niceToHaveSkills: [],
      seniorityLevel: { level: "Mid", confidence: "Low" },
      likelyInterviewCategories: [],
      mustProve: [],
      hiddenExpectations: [],
      interviewSignals: [],
      suggestedQuestionAngles: [],
    });
  }
}
