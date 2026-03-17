// Anthropic API integration for AI tutoring features

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

function getApiKey(): string {
  return import.meta.env.VITE_ANTHROPIC_API_KEY || '';
}

/**
 * Low-level call to the Anthropic Messages API.
 * Returns the text content of the first response block.
 */
export async function callAI(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'AI features are unavailable. Please set the VITE_ANTHROPIC_API_KEY environment variable.';
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return `AI request failed (${response.status}). Please try again later.`;
    }

    const data = await response.json();
    const textBlock = data.content?.find(
      (block: { type: string }) => block.type === 'text'
    );
    return textBlock?.text || 'No response from AI.';
  } catch (err) {
    console.error('AI call failed:', err);
    return 'Failed to connect to AI service. Please check your internet connection.';
  }
}

/**
 * Multi-turn AI tutor conversation.
 * Accepts an array of messages and card context for grounded responses.
 */
export async function getAITutorResponse(
  messages: { role: string; content: string }[],
  cardContext: string
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'AI tutor is unavailable. Please set the VITE_ANTHROPIC_API_KEY environment variable.';
  }

  const systemPrompt = `You are a helpful and encouraging study tutor for a Jewish law and Talmud exam (the "Kinneret" study program).
Your student is preparing for a test on the Oral Torah, Mishnah, Talmud, Halachah, and related Jewish legal concepts.

Context about the current card being studied:
${cardContext}

Guidelines:
- Be concise and encouraging
- Use simple explanations suitable for a student
- When discussing Hebrew terms, include transliterations
- Help with mnemonics and memory techniques
- If the student is struggling, break down concepts into smaller pieces
- Celebrate progress and correct answers`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return `AI tutor request failed (${response.status}). Please try again.`;
    }

    const data = await response.json();
    const textBlock = data.content?.find(
      (block: { type: string }) => block.type === 'text'
    );
    return textBlock?.text || 'No response from AI tutor.';
  } catch (err) {
    console.error('AI tutor call failed:', err);
    return 'Failed to connect to AI tutor. Please check your internet connection.';
  }
}

/**
 * Get an AI-generated explanation for a specific card.
 * Results can be cached in the AI cache layer.
 */
export async function getAIExplanation(
  cardId: string,
  term: string,
  definition: string,
  extendedNotes: string
): Promise<string> {
  const systemPrompt = `You are an expert tutor helping a student study for a Jewish law and Talmud exam.
Generate a clear, memorable explanation for the following term. Include:
1. A simple explanation in plain English
2. A mnemonic or memory trick to remember it
3. How it connects to the broader study of Oral Torah, Mishnah, Talmud, and Halachah
Keep your response concise (under 150 words).`;

  const userMessage = `Term: ${term}
Definition: ${definition}
${extendedNotes ? `Additional notes: ${extendedNotes}` : ''}
Card ID: ${cardId}

Please explain this term and give me a way to remember it.`;

  return callAI(systemPrompt, userMessage);
}

/**
 * Get AI-generated insights about a completed study session.
 */
export async function getAISessionInsights(
  sessionData: {
    mode: string;
    cardsStudied: number;
    correctCount: number;
    incorrectCount: number;
    averageTime: number;
    duration: number;
  },
  cardStates: Record<
    string,
    {
      difficulty: string;
      easeFactor: number;
      streak: number;
      incorrectReviews: number;
    }
  >
): Promise<string> {
  const totalCards = Object.keys(cardStates).length;
  const mastered = Object.values(cardStates).filter(
    (c) => c.difficulty === 'mastered'
  ).length;
  const learning = Object.values(cardStates).filter(
    (c) => c.difficulty === 'learning'
  ).length;
  const struggling = Object.values(cardStates).filter(
    (c) => c.incorrectReviews > 3
  );

  const systemPrompt = `You are a supportive study coach analyzing a student's Jewish law and Talmud study session.
Provide brief, encouraging feedback (under 100 words) with:
1. What went well
2. One specific area to focus on next
3. An encouraging closing thought
Be warm and positive but honest.`;

  const userMessage = `Session Summary:
- Mode: ${sessionData.mode}
- Cards studied: ${sessionData.cardsStudied}
- Correct: ${sessionData.correctCount}
- Incorrect: ${sessionData.incorrectCount}
- Average response time: ${sessionData.averageTime.toFixed(1)}s
- Session duration: ${Math.round(sessionData.duration / 60)} minutes

Overall Progress:
- Total cards: ${totalCards}
- Mastered: ${mastered}
- Still learning: ${learning}
- Struggling cards: ${struggling.length}

Please provide session insights.`;

  return callAI(systemPrompt, userMessage);
}

/**
 * Get an AI prediction about test readiness.
 */
export async function getAITestPrediction(
  cardStates: Record<
    string,
    {
      difficulty: string;
      easeFactor: number;
      repetitions: number;
      correctReviews: number;
      incorrectReviews: number;
      interval: number;
    }
  >,
  testDate: string
): Promise<string> {
  const totalCards = Object.keys(cardStates).length;
  const mastered = Object.values(cardStates).filter(
    (c) => c.difficulty === 'mastered'
  ).length;
  const review = Object.values(cardStates).filter(
    (c) => c.difficulty === 'review'
  ).length;
  const learning = Object.values(cardStates).filter(
    (c) => c.difficulty === 'learning'
  ).length;
  const newCards = Object.values(cardStates).filter(
    (c) => c.difficulty === 'new'
  ).length;
  const avgEase =
    Object.values(cardStates).reduce((sum, c) => sum + c.easeFactor, 0) /
    (totalCards || 1);

  const now = new Date();
  const test = new Date(testDate);
  const daysUntilTest = Math.max(
    0,
    Math.ceil((test.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  const systemPrompt = `You are an encouraging study coach helping a student prepare for their Jewish law and Talmud exam.
Based on the study statistics, provide:
1. An estimated readiness percentage
2. A brief assessment of strengths
3. Specific recommendations for the remaining study time
4. An encouraging message
Keep your response under 150 words. Be realistic but positive.`;

  const userMessage = `Test Date: ${testDate} (${daysUntilTest} days away)

Card Statistics:
- Total cards: ${totalCards}
- Mastered: ${mastered} (${((mastered / totalCards) * 100).toFixed(0)}%)
- In review: ${review}
- Still learning: ${learning}
- Not yet studied: ${newCards}
- Average ease factor: ${avgEase.toFixed(2)}

Please predict my test readiness and give recommendations.`;

  return callAI(systemPrompt, userMessage);
}
