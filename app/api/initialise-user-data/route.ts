import { NextResponse } from "next/server";
import {
  appwriteDatabase,
  hottakesDatabaseId,
} from "utils/appwriteServerConfig";
import Collections from "utils/appwriteCollections";

// recieves a web-hook request from appwrite whenever a new user is created
export async function POST(request: Request) {
  const requestBody = await request.json();
  try {
    await appwriteDatabase.createDocument(
      hottakesDatabaseId,
      Collections["User"],
      "",
      {
        userId: requestBody.$id,
      }
    );
  } catch (err) {
    console.error(err);
  }
  return NextResponse.json({ body: request.body });
}
