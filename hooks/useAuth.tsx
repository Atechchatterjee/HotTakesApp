import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { appwriteAccount } from "utils/appwriteConfig";

export function useAuth() {
  const [fetchedUser, setFetchedUser] =
    useState<Models.User<Models.Preferences>>();

  useEffect(() => {
    (async () => {
      const user = await appwriteAccount.get();
      setFetchedUser(user);
    })();
  }, []);

  return { user: fetchedUser, setUser: setFetchedUser };
}
