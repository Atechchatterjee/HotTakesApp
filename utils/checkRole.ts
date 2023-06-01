import { appwriteTeam } from "./appwriteConfig";

/**
 * Checks if the user belongs to a given role
 * User roles are determined by their presence in a "team" in appwrite
 
 * For eg: If the user is an admin, then the user should be present in "admin"
 * team in the appwrite backend.
 
 * @see https://appwrite.io/docs/client/teams
*/

export default async function checkRoles(role: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      // returns all teams the logged in user is a member of
      const { teams } = await appwriteTeam.list();
      resolve(!!(teams.filter((team) => team.name === role).length > 0));
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
