import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import path from "path";
import fs from "fs";

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// export const runtime = "edge";

let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 2000; // 2 seconds delay for rate limiting

interface Params {
  params: { chatId: string };
}

export async function GET(req: Request, { params }: Params) {
  const { chatId } = params;

  if (!chatId) {
    return NextResponse.json({ error: "chatId is required" }, { status: 400 });
  }

  try {
    // Construct the path to the chat file
    const chatFilePath = path.join(process.cwd(), `data/chats/${chatId}.json`);

    // Check if chat file exists
    if (!fs.existsSync(chatFilePath)) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Read and parse the chat data
    const chatData = JSON.parse(fs.readFileSync(chatFilePath, "utf-8"));
    // Return chat data in the response
    return NextResponse.json({ chatData });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
//v2
export const POST = async (req: Request, { params }: { params: { chatId: string } }): Promise<Response> => {
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_DELAY) {
    return new Response("Rate limit exceeded. Please wait a moment.", { status: 429 });
  }
  lastRequestTime = now;

  const { chatId } = params;

  try {
    const { messages, userId }: { messages: any[]; userId: string } = await req.json();
    const chatFilePath = path.join(process.cwd(), `data/chats/${chatId}.json`);

    // Check if chat file exists
    if (!fs.existsSync(chatFilePath)) {
      return new Response(JSON.stringify({ error: "Chat not found" }), { status: 404 });
    }

    // Read and parse the chat data
    const chatData = JSON.parse(fs.readFileSync(chatFilePath, "utf-8"));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });

    let assistantMessage = "";
    const stream = OpenAIStream(response);
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        let done;
        while (!(done = await reader.read()).done) {
          const content = decoder.decode(done.value, { stream: true });
          assistantMessage += content; // Accumulate the response text
          controller.enqueue(new TextEncoder().encode(content)); // Stream to client
        }
        controller.close();

        // Save the accumulated response as chat history once streaming is complete
        const allMessages = [...messages, { role: "assistant", content: assistantMessage }];
        const chatHistory = {
          chatId,
          userId,
          title: chatData.title,
          timestamp: new Date().toISOString(),
          messages: allMessages,
        };
        await fs.promises.writeFile(chatFilePath, JSON.stringify(chatHistory, null, 2), "utf-8");
      },
    });

    return new StreamingTextResponse(responseStream);
  } catch (error: any) {
    console.error("error:", error);
    if (error?.status === 429) {
      return new Response("Quota exceeded or rate limit hit. Please try again later.", { status: 429 });
    }
    return new Response("Error with OpenAI API", { status: 500 });
  }
};