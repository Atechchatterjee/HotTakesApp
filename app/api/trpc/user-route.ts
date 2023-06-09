import { appwriteUsers } from "utils/appwriteServerConfig";
import { z } from "zod";
import { publicProcedure } from "./trpc";

export function getUser() {
  return publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await appwriteUsers.get(input.userId);
        return {
          user: user,
        };
      } catch (err) {
        console.error(err);
        return {
          error: "Appwrite could not fetch user credentials",
        };
      }
    });
}
