import { Account, Client } from "appwrite";
import { env } from "~/env.mjs";

export const appwriteClient = new Client()
  .setEndpoint("http://localhost/v1")
  .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "");

export const appwriteAccount = new Account(appwriteClient);
