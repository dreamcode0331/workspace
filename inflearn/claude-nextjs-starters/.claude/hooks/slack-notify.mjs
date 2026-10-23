// Claude Code 훅(Notification: permission_prompt / Stop) → Slack Incoming Webhook 알림.
// 웹훅 URL은 프로젝트 루트 .env.local 의 SLACK_WEBHOOK_URL 에서 읽는다.
// 어떤 경우에도 stdout 출력 없이 exit 0 으로 끝나 Claude 동작에 영향을 주지 않는다.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MAX_SUMMARY = 300;
// 이 파일은 <프로젝트>/.claude/hooks/ 에 있으므로 두 단계 위가 프로젝트 루트
const PROJECT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return {};
  }
}

function loadProjectEnv(projectDir) {
  try {
    process.loadEnvFile(path.join(projectDir, ".env.local"));
  } catch {
    // .env.local 이 없으면 셸 환경변수만 사용
  }
}

function escapeMrkdwn(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function summarize(text) {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > MAX_SUMMARY ? `${oneLine.slice(0, MAX_SUMMARY)}…` : oneLine;
}

// last_assistant_message 가 없는 버전 대비: transcript JSONL 에서 마지막 assistant 텍스트를 찾는다.
function lastAssistantText(transcriptPath) {
  if (!transcriptPath) return "";
  try {
    const lines = readFileSync(transcriptPath, "utf8").trim().split("\n");
    for (let i = lines.length - 1; i >= 0; i--) {
      let entry;
      try {
        entry = JSON.parse(lines[i]);
      } catch {
        continue;
      }
      if (entry.type !== "assistant") continue;
      const content = entry.message?.content;
      const text = Array.isArray(content)
        ? content.filter((block) => block.type === "text").map((block) => block.text).join("\n")
        : typeof content === "string"
          ? content
          : "";
      if (text.trim()) return text;
    }
  } catch {
    // transcript 를 못 읽으면 요약 없이 보낸다
  }
  return "";
}

function buildMessage(input, project) {
  if (input.hook_event_name === "Notification") {
    return {
      title: `🔐 [${project}] 권한 요청`,
      body: input.message || "Claude가 권한 승인을 기다리고 있습니다.",
    };
  }
  if (input.hook_event_name === "Stop") {
    const last = input.last_assistant_message || lastAssistantText(input.transcript_path);
    return {
      title: `✅ [${project}] 작업 완료`,
      body: last ? summarize(last) : "Claude가 응답을 마쳤습니다.",
    };
  }
  return null;
}

async function main() {
  const input = readStdin();
  const cwd = input.cwd || process.cwd();
  loadProjectEnv(PROJECT_DIR);

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[slack-notify] SLACK_WEBHOOK_URL 이 설정되지 않아 알림을 건너뜁니다.");
    return;
  }

  const message = buildMessage(input, path.basename(cwd));
  if (!message) return;

  const time = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const payload = {
    ...(process.env.SLACK_CHANNEL && { channel: process.env.SLACK_CHANNEL }),
    username: "Claude Code",
    icon_emoji: ":robot_face:",
    text: `${message.title} — ${message.body}`,
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: `*${escapeMrkdwn(message.title)}*\n${escapeMrkdwn(message.body)}` },
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: `${time} · \`${escapeMrkdwn(cwd)}\`` }],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`[slack-notify] Slack 응답 ${res.status}: ${await res.text()}`);
    }
  } catch (error) {
    console.error(`[slack-notify] 전송 실패: ${error.message}`);
  }
}

await main();
process.exit(0);
