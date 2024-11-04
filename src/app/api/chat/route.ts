// api/chat/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs"; // Use this to set the runtime for your API route


export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json();

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 });
    }

    // Derive title from the first four words of the message
    const words = message.split(' ');
    const title = words.slice(0, 4).join(' '); // Join the first four words

    // Generate a unique chatId and current timestamp
    const chatId = uuidv4();
    const timestamp = new Date().toISOString();

    // Define paths for user and chat data
    const userFilePath = path.join(process.cwd(), `data/users/${userId}.json`);
    const chatFilePath = path.join(process.cwd(), `data/chats/${chatId}.json`);

    // Ensure user's file exists, if not, create it with an empty chats array
    let userData;
    if (fs.existsSync(userFilePath)) {
      userData = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));
    } else {
      userData = { userId, chats: [] };
      fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2), "utf-8");
    }

    // Append new chat entry (with chatId and timestamp) to user's chats
    userData.chats.push({ chatId, timestamp, title }); // Include title here
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2), "utf-8");

    // Create the chat file with initial data
    const chatData = {
      chatId,
      userId,
      title, // Include title in the chat data
      timestamp,
      messages: [
        {
          role: 'system',
          content: 'You are a medical chronology assistant for injury law cases.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    };
    fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2), "utf-8");

    // Respond with the new chatId
    return NextResponse.json({ chatId, title, timestamp });
  } catch (error) {
    console.error("Error handling POST /api/chat:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}

// Handle GET request to retrieve list of chat IDs for a given userId
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId query parameter is required" }, { status: 400 });
  }

  // Define path for user data
  const userFilePath = path.join(process.cwd(), `data/users/${userId}.json`);

  // Check if user's data file exists
  if (!fs.existsSync(userFilePath)) {
    // If the user file doesn't exist, create a new user data file
    const newUserData = { userId, chats: [] };
    fs.writeFileSync(userFilePath, JSON.stringify(newUserData, null, 2), "utf-8");
    return NextResponse.json({ message: "User created", chats: [] }); // Respond with empty chats
  }

  // Read and parse user data
  const userData = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));

  // Respond with the list of chats (chatId and timestamp)
  return NextResponse.json({ chats: userData.chats });
}