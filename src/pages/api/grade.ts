import type { APIRoute } from 'astro';
import { OAuth2Client } from 'google-auth-library';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const prerender = false;

const CLIENT_ID = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;
const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;

const oauth = new OAuth2Client(CLIENT_ID);

const SYSTEM_PROMPT = `あなたは情報処理安全確保支援士（SC）試験の午後問題を採点するベテラン採点者です。
受験者の記述式答案を以下の基準で採点・添削してください。

【採点基準】
- 模範解答との内容一致度（要点を押さえているか）
- キーワードの的確さ（試験で評価される専門用語が含まれるか）
- 文字数（指定字数の ±10% 以内か）
- 文末（「〜こと。」「〜から。」「〜ため。」など問いに対応する語尾か）
- 論理性（因果関係が明確か）

【出力フォーマット（必ず JSON で返す）】
{
  "score": 0-100 の整数,
  "rank": "A" | "B" | "C" | "D",
  "good_points": ["良かった点を箇条書きで 1〜3 個"],
  "improvements": ["改善点を箇条書きで 1〜3 個"],
  "model_answer_example": "あなたが書く模範解答例（指定字数内）",
  "key_terms_missing": ["答案に含めるべきだった用語"],
  "overall_comment": "全体講評（2〜3 文）"
}

JSON 以外のテキスト（説明・前置き・コードブロック記号など）は一切出力しないこと。`;

type GradeRequest = {
  question: string;
  context?: string;
  charLimit?: number;
  userAnswer: string;
};

export const POST: APIRoute = async ({ request }) => {
  if (!CLIENT_ID || !GEMINI_API_KEY) {
    return json({ error: 'サーバの環境変数が未設定です (PUBLIC_GOOGLE_CLIENT_ID / GEMINI_API_KEY)' }, 500);
  }

  const auth = request.headers.get('authorization') ?? '';
  const idToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!idToken) return json({ error: 'Google サインインが必要です' }, 401);

  let email = '';
  try {
    const ticket = await oauth.verifyIdToken({ idToken, audience: CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error('email missing');
    email = payload.email;
  } catch {
    return json({ error: '認証トークンが無効です' }, 401);
  }

  let body: GradeRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'リクエスト形式が不正です' }, 400);
  }

  const question = (body.question ?? '').trim();
  const userAnswer = (body.userAnswer ?? '').trim();
  if (!question || !userAnswer) {
    return json({ error: '設問と答案の両方が必要です' }, 400);
  }
  if (userAnswer.length > 2000) {
    return json({ error: '答案が長すぎます (最大 2000 文字)' }, 400);
  }

  const charLimit = body.charLimit ?? 50;
  const context = body.context ? `【問題文の前提】\n${body.context}\n\n` : '';

  const userPrompt = `${context}【設問】
${question}

【指定字数】
${charLimit} 字以内

【受験者の答案】
${userAnswer}

上記を採点し、指定された JSON フォーマットで返してください。`;

  try {
    const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genai.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
    });
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return json({ ok: true, grading: parsed, gradedBy: email });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ error: `採点に失敗しました: ${msg}` }, 502);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
