import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { toErrorResponse, type AppErrorResponse } from "@/lib/app-errors";
import {
  getAverageViewCount,
  getEngagementRate,
  getOutlierVideos,
  getTopVideos,
  getUploadCadenceDays,
} from "@/lib/metrics";
import { analyzeSuccessSchema } from "@/lib/schemas";
import type { ChannelAnalysis } from "@/types/analysis";
import type { YouTubeCollectResult, YouTubeVideo } from "@/types/youtube";
import type { CollectChannelDataResult } from "./youtube";

const DEFAULT_CLAUDE_MODEL = "claude-sonnet-4-6";

export type ChannelAnalysisResult =
  | {
      ok: true;
      data: ChannelAnalysis;
    }
  | {
      ok: false;
      error: AppErrorResponse;
    };

interface AnalyzeChannelDataOptions {
  apiKey?: string;
  model?: string;
  client?: Anthropic;
}

export async function analyzeChannelData(
  input: CollectChannelDataResult,
  options: AnalyzeChannelDataOptions = {},
): Promise<ChannelAnalysisResult> {
  if (!input.ok) {
    return {
      ok: false,
      error: input.error,
    };
  }

  const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error: toErrorResponse("MISSING_CLAUDE_API_KEY"),
    };
  }

  const model = options.model ?? process.env.CLAUDE_MODEL ?? DEFAULT_CLAUDE_MODEL;
  const client = options.client ?? new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: buildSystemPrompt(),
      tools: [
        {
          name: "analyze_channel",
          description: "YouTube 채널 분석 결과를 구조화된 형식으로 반환합니다.",
          input_schema: analysisJsonSchema as Anthropic.Tool["input_schema"],
        },
      ],
      tool_choice: { type: "tool", name: "analyze_channel" },
      messages: [
        {
          role: "user",
          content: JSON.stringify(buildAnalysisInput(input.data)),
        },
      ],
    });

    const toolUseBlock = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );

    if (!toolUseBlock) {
      return {
        ok: false,
        error: toErrorResponse("CLAUDE_REFUSAL"),
      };
    }

    const parsed = analyzeSuccessSchema.safeParse(toolUseBlock.input);

    if (!parsed.success) {
      return {
        ok: false,
        error: toErrorResponse("CLAUDE_REFUSAL"),
      };
    }

    return {
      ok: true,
      data: parsed.data,
    };
  } catch {
    return {
      ok: false,
      error: toErrorResponse("CLAUDE_PROVIDER_ERROR"),
    };
  }
}

function buildSystemPrompt() {
  return [
    "당신은 YouTube 채널 운영자를 위한 한국어 콘텐츠 전략 분석가입니다.",
    "수집된 공개 채널 데이터만 근거로 분석하고, 데이터 기반 근거와 AI 추론을 구분해 표현하세요.",
    "핵심 질문은 '다음에 무엇을 만들까?'입니다.",
    "추상적인 조언보다 다음 영상 제작 결정, 반복할 패턴, 줄일 행동, 실행 체크리스트를 우선하세요.",
    "최근 공개 영상 sample size가 작거나 주요 통계가 누락되면 confidence를 낮추고 이유를 설명하세요.",
    "반드시 제공된 tool의 input_schema를 만족하는 JSON만 반환하세요.",
  ].join("\n");
}

function buildAnalysisInput(input: YouTubeCollectResult) {
  const topVideos = getTopVideos(input.videos, 10);
  const outlierVideos = getOutlierVideos(input.videos);

  return {
    channel: input.channel,
    sampleSize: input.sampleSize,
    collectedAt: input.collectedAt,
    metrics: {
      averageViewCount: getAverageViewCount(input.videos),
      uploadCadenceDays: getUploadCadenceDays(input.videos),
      topVideos: topVideos.map(toVideoMetricSnapshot),
      outlierVideos: outlierVideos.map(toVideoMetricSnapshot),
    },
    videos: input.videos.map(toVideoMetricSnapshot),
  };
}

function toVideoMetricSnapshot(video: YouTubeVideo) {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    publishedAt: video.publishedAt,
    viewCount: video.viewCount,
    likeCount: video.likeCount,
    commentCount: video.commentCount,
    duration: video.duration,
    engagementRate: getEngagementRate(video),
  };
}

const analysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "overallScore",
    "executiveSummary",
    "strongSignals",
    "growthBottlenecks",
    "contentPatterns",
    "recommendedNextVideos",
    "actionChecklist",
    "confidence",
  ],
  properties: {
    overallScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    executiveSummary: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "string",
      },
    },
    strongSignals: {
      type: "array",
      items: {
        type: "string",
      },
    },
    growthBottlenecks: {
      type: "array",
      items: {
        type: "string",
      },
    },
    contentPatterns: {
      type: "array",
      items: {
        type: "string",
      },
    },
    recommendedNextVideos: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "titleDirection",
          "format",
          "whyItFits",
          "evidence",
          "expectedImpact",
          "difficulty",
        ],
        properties: {
          titleDirection: {
            type: "string",
          },
          format: {
            type: "string",
          },
          whyItFits: {
            type: "string",
          },
          evidence: {
            type: "string",
          },
          expectedImpact: {
            type: "string",
          },
          difficulty: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
        },
      },
    },
    actionChecklist: {
      type: "array",
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["priority", "task", "reason", "expectedImpact"],
        properties: {
          priority: {
            type: "string",
            enum: ["high", "medium", "low"],
          },
          task: {
            type: "string",
          },
          reason: {
            type: "string",
          },
          expectedImpact: {
            type: "string",
          },
        },
      },
    },
    confidence: {
      type: "object",
      additionalProperties: false,
      required: ["level", "reason"],
      properties: {
        level: {
          type: "string",
          enum: ["high", "medium", "low"],
        },
        reason: {
          type: "string",
        },
      },
    },
  },
} as const;
