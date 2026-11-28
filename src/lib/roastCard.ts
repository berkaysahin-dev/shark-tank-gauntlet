import { PitchData, JurorRuntimeState, VerdictSummary, TurnExchange } from "@/types/gauntlet";
import { JURORS } from "@/config/personas";
import { Language } from "@/locales/i18n";

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length === maxLines) break;
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, -3).trimEnd()}...`;
  }
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function downloadRoastCardPng(params: {
  pitch: PitchData;
  verdict: VerdictSummary;
  jurorStates: Record<string, JurorRuntimeState>;
  history: TurnExchange[];
  lang: Language;
}) {
  const { pitch, verdict, jurorStates, history, lang } = params;
  const isTr = lang === "tr";

  const width = 1200;
  const height = 630;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#09090b");
  grad.addColorStop(1, "#111827");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle accent glow
  const glow = ctx.createRadialGradient(980, 120, 20, 980, 120, 420);
  const statusColor =
    verdict.termSheetStatus === "ACCEPTED"
      ? "#10b981"
      : verdict.termSheetStatus === "CONDITIONAL"
      ? "#f59e0b"
      : "#f43f5e";
  glow.addColorStop(0, `${statusColor}30`);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Card frame
  drawRoundedRect(ctx, 36, 36, width - 72, height - 72, 28);
  ctx.fillStyle = "rgba(22, 22, 26, 0.88)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.stroke();

  // Header brand
  ctx.fillStyle = "#2997ff";
  ctx.beginPath();
  ctx.arc(84, 86, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "600 16px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  ctx.fillText("THE GAUNTLET  ·  ADVERSARIAL PITCH SCORECARD", 104, 92);

  // Status badge pill on top right
  const badgeLabel =
    verdict.termSheetStatus === "ACCEPTED"
      ? isTr
        ? "KABUL: TEKLİF VAR"
        : "DEAL ACCEPTED"
      : verdict.termSheetStatus === "CONDITIONAL"
      ? isTr
        ? "ŞARTLI ONAY"
        : "CONDITIONAL"
      : isTr
      ? "TEKLİF YOK"
      : "NO DEAL";

  ctx.font = "700 15px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  const badgeW = ctx.measureText(badgeLabel).width + 44;
  drawRoundedRect(ctx, width - 76 - badgeW, 66, badgeW, 38, 19);
  ctx.fillStyle = `${statusColor}22`;
  ctx.fill();
  ctx.strokeStyle = `${statusColor}88`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = statusColor;
  ctx.fillText(badgeLabel, width - 76 - badgeW + 22, 91);

  // Product Name & One-Liner
  ctx.fillStyle = "#fafafa";
  ctx.font = "700 44px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  ctx.fillText(pitch.productName.slice(0, 32), 76, 165);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "400 20px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  const oneLinerLines = wrapCanvasText(ctx, pitch.oneLiner, 690, 2);
  oneLinerLines.forEach((line, idx) => {
    ctx.fillText(line, 76, 205 + idx * 28);
  });

  // Big Score Box on Right
  drawRoundedRect(ctx, 840, 134, 280, 126, 20);
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.stroke();

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "600 14px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  ctx.fillText(isTr ? "ORTALAMA İKNA" : "AVERAGE CONVICTION", 866, 168);

  ctx.fillStyle = statusColor;
  ctx.font = "700 54px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  const avgLabel = isTr ? `%${verdict.averageConviction}` : `${verdict.averageConviction}%`;
  ctx.fillText(avgLabel, 866, 232);

  ctx.fillStyle = "#d4d4d8";
  ctx.font = "500 15px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  ctx.fillText(`${verdict.convincedCount}/${JURORS.length} ${isTr ? "Jüri İkna" : "Convinced"}`, 1005, 226);

  // 5 Jurors Progress Row
  const startY = 292;
  const barCardW = 196;
  const gap = 16;

  JURORS.forEach((juror, idx) => {
    const x = 76 + idx * (barCardW + gap);
    const conv = jurorStates[juror.id]?.conviction ?? juror.initialConviction;
    const jurorWon = conv >= 60;
    const jColor = jurorWon ? "#10b981" : conv <= 20 ? "#f43f5e" : "#f59e0b";

    drawRoundedRect(ctx, x, startY, barCardW, 92, 16);
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fill();
    ctx.strokeStyle = jurorWon ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)";
    ctx.stroke();

    ctx.fillStyle = "#e4e4e7";
    ctx.font = "600 15px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
    ctx.fillText((isTr ? juror.nameTr : juror.name).slice(0, 18), x + 16, startY + 30);

    ctx.fillStyle = jColor;
    ctx.font = "700 22px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
    ctx.fillText(isTr ? `%${conv}` : `${conv}%`, x + 16, startY + 62);

    // Bar track
    drawRoundedRect(ctx, x + 16, startY + 74, barCardW - 32, 6, 3);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fill();
    drawRoundedRect(ctx, x + 16, startY + 74, Math.max(8, ((barCardW - 32) * conv) / 100), 6, 3);
    ctx.fillStyle = jColor;
    ctx.fill();
  });

  // Brutal Quote / Biggest Weak Spot Box
  const worstTurn = [...history].sort((a, b) => a.scoreDelta - b.scoreDelta)[0];
  const quoteTitle = isTr ? "EN SERT GERİ BİLDİRİM / ZAYIF NOKTA" : "HARSHEST TAKEAWAY / WEAKEST SPOT";
  const quoteBody = worstTurn?.jurorReaction || verdict.lethalVulnerability;

  drawRoundedRect(ctx, 76, 408, width - 152, 114, 18);
  ctx.fillStyle = "rgba(244, 63, 94, 0.08)";
  ctx.fill();
  ctx.strokeStyle = "rgba(244, 63, 94, 0.28)";
  ctx.stroke();

  ctx.fillStyle = "#fb7185";
  ctx.font = "700 13px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  ctx.fillText(quoteTitle, 98, 438);

  ctx.fillStyle = "#f4f4f5";
  ctx.font = "500 18px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  const quoteLines = wrapCanvasText(ctx, `“${quoteBody}”`, width - 196, 2);
  quoteLines.forEach((line, idx) => {
    ctx.fillText(line, 98, 470 + idx * 26);
  });

  // Footer
  ctx.fillStyle = "#71717a";
  ctx.font = "500 16px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  ctx.fillText("gauntlet.berkaysahin.net  ·  Test your startup before real customers say no.", 76, 566);

  ctx.fillStyle = "#2997ff";
  ctx.font = "600 16px -apple-system, BlinkMacSystemFont, Inter, sans-serif";
  ctx.fillText("github.com/berkaysahin-dev/shark-tank-gauntlet", 748, 566);

  // Trigger download
  const slug =
    pitch.productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "startup";

  const link = document.createElement("a");
  link.download = `${slug}-gauntlet-card.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
