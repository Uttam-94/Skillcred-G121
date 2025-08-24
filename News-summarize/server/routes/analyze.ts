import { RequestHandler } from "express";
import { z } from "zod";

const analyzeRequestSchema = z.object({
  content: z.string().min(1),
  type: z.enum(["url", "text"])
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";
const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_AI_MODEL = process.env.DEFAULT_AI_MODEL || "openai/gpt-3.5-turbo";
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || "400");
const TEMPERATURE = parseFloat(process.env.TEMPERATURE || "0.3");

export const handleAnalyze: RequestHandler = async (req, res) => {
  try {
    // Validate API key exists
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "your_openrouter_api_key_here") {
      return res.status(500).json({
        error: "OpenRouter API key not configured",
        message: "Please set OPENROUTER_API_KEY in your .env file. See API_CONFIGURATION.md for details."
      });
    }

    const validatedRequest = analyzeRequestSchema.parse(req.body);
    const { content, type } = validatedRequest;

    // Define prompts for all three summary tones
    const summaryPrompts = {
      neutral: `Provide a balanced, neutral summary of this news content. Focus on presenting facts without bias and maintain objectivity. Keep it concise but comprehensive.\n\nContent: ${content}`,
      facts: `Extract only the key facts from this news content. List the most important factual information, data points, numbers, dates, and verifiable claims without opinions or interpretations.\n\nContent: ${content}`,
      child: `Explain this news content in simple terms that a 10-year-old could understand. Use easy words, short sentences, and relatable concepts. Avoid complex terms and jargon.\n\nContent: ${content}`
    };

    const biasPrompt = `Analyze this news content for potential bias and sentiment. Provide your analysis in this exact format:

SENTIMENT: [positive/negative/neutral]
BIAS_SCORE: [number between 0-100]
FACTORS: [3 key factors that influenced this analysis, separated by semicolons]

Content to analyze: ${content}`;

    // Make parallel API calls for all summaries and bias analysis
    const [neutralResponse, factsResponse, childResponse, biasResponse] = await Promise.all([
      fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://news-summarizer.app",
          "X-Title": "News Summarizer & Bias Detector"
        },
        body: JSON.stringify({
          model: DEFAULT_AI_MODEL,
          messages: [{ role: "user", content: summaryPrompts.neutral }],
          max_tokens: MAX_TOKENS,
          temperature: TEMPERATURE
        })
      }),
      fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://news-summarizer.app",
          "X-Title": "News Summarizer & Bias Detector"
        },
        body: JSON.stringify({
          model: DEFAULT_AI_MODEL,
          messages: [{ role: "user", content: summaryPrompts.facts }],
          max_tokens: Math.floor(MAX_TOKENS * 0.75),
          temperature: TEMPERATURE * 0.7
        })
      }),
      fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://news-summarizer.app",
          "X-Title": "News Summarizer & Bias Detector"
        },
        body: JSON.stringify({
          model: DEFAULT_AI_MODEL,
          messages: [{ role: "user", content: summaryPrompts.child }],
          max_tokens: Math.floor(MAX_TOKENS * 0.75),
          temperature: TEMPERATURE * 1.3
        })
      }),
      fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://news-summarizer.app",
          "X-Title": "News Summarizer & Bias Detector"
        },
        body: JSON.stringify({
          model: DEFAULT_AI_MODEL,
          messages: [{ role: "user", content: biasPrompt }],
          max_tokens: Math.floor(MAX_TOKENS * 0.5),
          temperature: TEMPERATURE * 0.3
        })
      })
    ]);

    // Check if all responses are successful
    if (!neutralResponse.ok || !factsResponse.ok || !childResponse.ok || !biasResponse.ok) {
      throw new Error("Failed to analyze content");
    }

    // Parse all responses
    const [neutralData, factsData, childData, biasData] = await Promise.all([
      neutralResponse.json(),
      factsResponse.json(),
      childResponse.json(),
      biasResponse.json()
    ]);

    const summaries = {
      neutral: neutralData.choices[0]?.message?.content || "Unable to generate neutral summary",
      facts: factsData.choices[0]?.message?.content || "Unable to generate facts summary",
      child: childData.choices[0]?.message?.content || "Unable to generate simplified summary"
    };

    const biasAnalysis = biasData.choices[0]?.message?.content || "";

    // Parse bias analysis with improved parsing
    let sentiment: "positive" | "negative" | "neutral" = "neutral";
    let score = 50;
    let factors = ["Content analysis", "Language assessment", "Source evaluation"];

    try {
      const sentimentMatch = biasAnalysis.match(/SENTIMENT:\s*(positive|negative|neutral)/i);
      const scoreMatch = biasAnalysis.match(/BIAS_SCORE:\s*(\d+)/i);
      const factorsMatch = biasAnalysis.match(/FACTORS:\s*(.+?)(?:\n|$)/i);

      if (sentimentMatch) {
        sentiment = sentimentMatch[1].toLowerCase() as "positive" | "negative" | "neutral";
      }
      if (scoreMatch) {
        score = Math.min(100, Math.max(0, parseInt(scoreMatch[1])));
      }
      if (factorsMatch) {
        factors = factorsMatch[1].split(';').map(f => f.trim()).slice(0, 3);
      }
    } catch (parseError) {
      console.warn("Failed to parse bias analysis, using defaults", parseError);
    }

    const result = {
      summaries,
      bias: {
        sentiment,
        score,
        factors
      }
    };

    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request format",
        details: error.errors
      });
    }

    res.status(500).json({
      error: "Failed to analyze content",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
