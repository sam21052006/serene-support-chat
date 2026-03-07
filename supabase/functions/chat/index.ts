import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(5000),
});

const MessagesSchema = z.array(MessageSchema).min(1).max(50);

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "don't want to live",
  "want to die", "self harm", "hurt myself", "no point in living",
  "better off dead", "end it all", "take my life", "suicidal"
];

function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function detectMood(message: string): string | null {
  const lower = message.toLowerCase();

  const veryHappyWords = ["amazing", "fantastic", "thrilled", "ecstatic", "overjoyed", "elated", "wonderful", "incredible", "so happy", "best day", "love life", "on top of the world"];
  const happyWords = ["happy", "good", "great", "fine", "okay", "positive", "grateful", "thankful", "excited", "joyful", "cheerful", "content", "pleased", "glad", "enjoying", "smile", "hopeful", "optimistic", "better"];
  const sadWords = ["sad", "unhappy", "down", "blue", "disappointed", "upset", "crying", "miss", "lonely", "heartbroken", "gloomy", "miserable", "hurt", "pain", "lost", "empty", "numb", "tired of"];
  const verySadWords = ["hopeless", "despair", "devastated", "worthless", "hate myself", "can't go on", "unbearable", "broken", "shattered", "agonizing", "terrible", "worst", "rock bottom", "give up"];
  const anxiousWords = ["anxious", "stressed", "worried", "nervous", "panic", "overwhelmed", "fear", "scared", "tense", "restless", "uneasy", "dread", "pressure", "can't sleep", "insomnia", "burnout", "exhausted", "frustrated", "angry", "irritated"];

  if (verySadWords.some(w => lower.includes(w))) return "very_sad";
  if (veryHappyWords.some(w => lower.includes(w))) return "very_happy";
  if (sadWords.some(w => lower.includes(w))) return "sad";
  if (anxiousWords.some(w => lower.includes(w))) return "neutral";
  if (happyWords.some(w => lower.includes(w))) return "happy";

  return null;
}

const CRISIS_RESPONSE = `I'm deeply concerned about what you've shared, and I want you to know that you're not alone. Your life matters, and there are people who want to help.

**Please reach out to a crisis helpline immediately:**
- **National Suicide Prevention Lifeline (US):** 988 or 1-800-273-8255
- **Crisis Text Line:** Text HOME to 741741
- **International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/

If you're in immediate danger, please call emergency services (911 in the US) or go to your nearest emergency room.

I'm here to listen and support you, but professional help is the most important step right now. You deserve care and support. 💙`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input
    const body = await req.json();
    const validationResult = MessagesSchema.safeParse(body.messages);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messages = validationResult.data;

    // Check for Lovable AI API key
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    // Check for crisis in the latest user message
    const latestUserMessage = messages.filter((m) => m.role === "user").pop();
    const isCrisis = latestUserMessage && detectCrisis(latestUserMessage.content);
    const detectedMood = latestUserMessage ? detectMood(latestUserMessage.content) : null;

    if (isCrisis) {
      console.log("Crisis detected - returning crisis response");
      return new Response(
        JSON.stringify({ 
          content: CRISIS_RESPONSE,
          isCrisis: true,
          detectedMood: "very_sad"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are MindfulAI, a compassionate and supportive mental health companion. Your role is to:

1. Listen actively and empathetically to users' feelings and concerns
2. Provide thoughtful, non-judgmental responses
3. Offer evidence-based coping strategies and mental wellness tips
4. Encourage professional help when appropriate
5. Share relevant resources and techniques for managing stress, anxiety, and other emotions

Guidelines:
- Always be warm, supportive, and understanding
- Never diagnose conditions or prescribe treatments
- Suggest professional help for serious concerns
- Use calming, reassuring language
- Offer practical coping strategies when appropriate
- Remember you're a supportive companion, not a replacement for professional care

When asked for advice, you can search for and suggest relevant self-help resources, breathing exercises, mindfulness techniques, and general wellness tips.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I'm here to listen. How can I support you today?";

    console.log("Chat response generated successfully, detected mood:", detectedMood);
    
    return new Response(
      JSON.stringify({ content, isCrisis: false, detectedMood }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
