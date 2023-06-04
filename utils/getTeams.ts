import { Models } from "appwrite";
import { appwriteTeam } from "./appwriteConfig";

// returns all teams the logged in user is a member of
export default async function getTeams(): Promise<
  Models.Team<Models.Preferences>[]
> {
  return new Promise(async (resolve, reject) => {
    try {
      const { teams } = await appwriteTeam.list();
      resolve(teams);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
