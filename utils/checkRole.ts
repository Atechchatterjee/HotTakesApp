import getTeams from "./getTeams";

/**
 * Checks if the user belongs to a given role
 * User roles are determined by their presence in a "team" in appwrite
 
 * For eg: If the user is an admin, then the user should be present in "admin"
 * team in the appwrite backend.
 
 * @see https://appwrite.io/docs/client/teams
*/

export default async function checkRoles(role: string): Promise<boolean> {
  const teams = await getTeams();
  const noOfTeams = teams.filter((team) => team.name === role).length;
  if (noOfTeams > 0) return Promise.resolve(true);
  else return Promise.reject();
}
