import { describe, expect, it, vi } from "vitest";
import Anthropic from "@anthropic-ai/sdk";
import type { ChannelAnalysis } from "@/types/analysis";
import type { YouTubeCollectResult } from "@/types/youtube";
import { analyzeChannelData } from "./claude";

const collectPayload: YouTubeCollectResult = {
  channel: {
    id: "UC_x5XG1OV2P6uZZ5FSM9Ttw",
    title: "Google for Developers",
    description: "Developer videos",
    thumbnailUrl: null,
    subscriberCount: 1000,
    viewCount: 500000,
    videoCount: 120,
  },
  videos: [
    {
      id: "video-a",
      title: "First video",
      description: "First description",
      publishedAt: "2026-05-08T00:00:00Z",
      thumbnailUrl: null,
      viewCount: 100,
      likeCount: 10,
      commentCount: 1,
      duration: "PT10M",
    },
  ],
  sampleSize: 1,
  collectedAt: "2026-05-08T00:00:00Z",
};

const analysisPayload: ChannelAnalysis = {
  overallScore: 82,
  executiveSummary: ["요약 1", "요약 2", "요약 3"],
  strongSignals: ["조회수가 높은 포맷이 반복됩니다."],
  growthBottlenecks: ["업로드 간격이 불규칙합니다."],
  contentPatterns: ["실전 예제형 콘텐츠가 반응이 좋습니다."],
  recommendedNextVideos: [
    {
      titleDirection: "다음 영상 제목 방향",
      format: "튜토리얼",
      whyItFits: "기존 상위 영상과 포맷이 같습니다.",
      evidence: "First video가 평균 이상입니다.",
      expectedImpact: "재방문 시청자를 늘릴 수 있습니다.",
      difficulty: "low",
    },
  ],
  actionChecklist: [
    {
      priority: "high",
      task: "상위 영상의 제목 구조를 반복한다.",
      reason: "성과가 검증된 패턴입니다.",
      expectedImpact: "클릭률 개선 가능성이 있습니다.",
    },
  ],
  confidence: {
    level: "medium",
    reason: "최근 공개 영상 1개 기준이라 표본이 작습니다.",
  },
};

function mockClient(content: Anthropic.ContentBlock[]) {
  return {
    messages: {
      create: vi.fn().mockResolvedValue({
        id: "msg_test",
        type: "message",
        role: "assistant",
        content,
        model: "claude-sonnet-4-6",
        stop_reason: "tool_use",
        usage: { input_tokens: 100, output_tokens: 200 },
      }),
    },
  } as unknown as Anthropic;
}

function mockClientError(error: Error) {
  return {
    messages: {
      create: vi.fn().mockRejectedValue(error),
    },
  } as unknown as Anthropic;
}

describe("analyzeChannelData", () => {
  it("calls Claude Messages API with tool_use schema and parses response", async () => {
    const client = mockClient([
      {
        type: "tool_use",
        id: "toolu_test",
        name: "analyze_channel",
        input: analysisPayload,
      },
    ]);

    const result = await analyzeChannelData(
      { ok: true, data: collectPayload },
      { apiKey: "test-anthropic-key", model: "claude-sonnet-4-6", client },
    );

    expect(result).toEqual({ ok: true, data: analysisPayload });

    const createCall = (client.messages.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(createCall.model).toBe("claude-sonnet-4-6");
    expect(createCall.tool_choice).toEqual({ type: "tool", name: "analyze_channel" });
    expect(createCall.tools[0].name).toBe("analyze_channel");
    expect(createCall.system).toContain("한국어");
    expect(createCall.messages[0].content).toContain("averageViewCount");
    expect(JSON.stringify(createCall)).not.toContain("test-anthropic-key");
  });

  it("returns missing key error when apiKey is empty", async () => {
    const result = await analyzeChannelData(
      { ok: true, data: collectPayload },
      { apiKey: "" },
    );

    expect(result).toMatchObject({
      ok: false,
      error: {
        error: { code: "MISSING_CLAUDE_API_KEY" },
        status: 500,
      },
    });
  });

  it("returns provider error on any thrown error", async () => {
    const client = mockClientError(new Error("network error"));

    const result = await analyzeChannelData(
      { ok: true, data: collectPayload },
      { apiKey: "test-key", client },
    );

    expect(result).toMatchObject({
      ok: false,
      error: {
        error: {
          code: "CLAUDE_PROVIDER_ERROR",
          message: "AI 분석 요청을 처리하지 못했습니다.",
        },
        status: 502,
      },
    });
  });

  it("returns refusal error when no tool_use block in response", async () => {
    const client = mockClient([
      { type: "text", text: "I cannot analyze this channel." },
    ]);

    const result = await analyzeChannelData(
      { ok: true, data: collectPayload },
      { apiKey: "test-key", client },
    );

    expect(result).toMatchObject({
      ok: false,
      error: { error: { code: "CLAUDE_REFUSAL" } },
    });
  });

  it("propagates upstream error without calling Claude", async () => {
    const client = mockClient([]);

    const result = await analyzeChannelData(
      {
        ok: false,
        error: { error: { code: "YOUTUBE_PROVIDER_ERROR", message: "error" }, status: 502 },
      },
      { client },
    );

    expect(result.ok).toBe(false);
    expect((client.messages.create as ReturnType<typeof vi.fn>)).not.toHaveBeenCalled();
  });
});
