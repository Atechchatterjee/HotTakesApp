import {
  Users,
  Account,
  Avatars,
  Client,
  Databases,
  Teams,
} from "node-appwrite";
import { env } from "env.mjs";

export const appwriteClient = new Client()
  .setEndpoint(env.NEXT_PUBLIC_APPWRITE_PROJECT_ENDPOINT)
  .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "")
  .setKey(env.APPWRITE_API_KEY);

export const hottakesDatabaseId = "646eed2e4349377fd47a";
export const appwriteDatabase = new Databases(appwriteClient);
export const appwriteAccount = new Account(appwriteClient);
export const appwriteAvatars = new Avatars(appwriteClient);
export const appwriteTeam = new Teams(appwriteClient);
export const appwriteUsers = new Users(appwriteClient);
