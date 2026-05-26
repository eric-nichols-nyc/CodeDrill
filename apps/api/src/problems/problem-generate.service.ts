import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, type ValidationError } from "class-validator";
import { CreateProblemDto } from "./dto/create-problem.dto";
import {
  AI_PROBLEM_GENERATE_MODEL,
  AI_PROBLEM_GENERATE_SYSTEM_PROMPT,
  OPENAI_CHAT_COMPLETIONS_URL,
} from "./problem-generate.constants";
import {
  parseModelJsonObject,
  readOpenAiAssistantContent,
  readOpenAiErrorMessage,
} from "./openai-completion.util";

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

    if (error.children && error.children.length > 0) {
      Object.assign(fieldErrors, flattenValidationErrors(error.children, path));
    }
  }

  return fieldErrors;
}

@Injectable()
export class ProblemGenerateService {
  async generateFromPrompt(prompt: string): Promise<{ problem: CreateProblemDto }> {
    const trimmedPrompt = prompt.trim();
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      throw new ServiceUnavailableException(
        "OPENAI_API_KEY is not set on the API. Add it to apps/api/.env and restart the API."
      );
    }

    const upstream = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_PROBLEM_GENERATE_MODEL,
        temperature: 0.25,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: AI_PROBLEM_GENERATE_SYSTEM_PROMPT },
          {
            role: "user",
            content: `${trimmedPrompt}\n\nReturn only one JSON object for the problem form as specified. You MUST include "solutions" (at least one complete reference solution with explanation and complexity) and "hints" (at least 2 progressive hints).`,
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
        error: "OpenAI returned an empty message.",
      });
    }

    let parsedJson: unknown;
    try {
      parsedJson = parseModelJsonObject(content);
    } catch (error) {
      const detail =
        error instanceof Error && error.message.length > 0
          ? error.message
          : "Invalid JSON from model";
      throw new BadGatewayException({
        error: "Could not parse model output as JSON.",
        detail,
      });
    }

    const problem = plainToInstance(CreateProblemDto, parsedJson);
    const validationErrors = await validate(problem, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (validationErrors.length > 0) {
      throw new UnprocessableEntityException({
        error: "Model JSON failed validation.",
        issues: { fieldErrors: flattenValidationErrors(validationErrors) },
      });
    }

    if (!problem.solutions || problem.solutions.length === 0) {
      throw new UnprocessableEntityException({
        error: "Model JSON failed validation.",
        issues: {
          fieldErrors: {
            solutions: ["At least one reference solution is required."],
          },
        },
      });
    }

    if (!problem.hints || problem.hints.length < 2) {
      throw new UnprocessableEntityException({
        error: "Model JSON failed validation.",
        issues: {
          fieldErrors: {
            hints: ["At least two progressive hints are required."],
          },
        },
      });
    }

    return { problem };
  }
}
