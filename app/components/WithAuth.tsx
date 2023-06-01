import { useState, useEffect } from "react";
import { appwriteAccount, appwriteAvatars } from "utils/appwriteConfig";
import { useRouter } from "next/navigation";
import { Models } from "appwrite";
import { useStore } from "store";
import checkRoles from "utils/checkRole";

// Wrapper Component to implement protected routes
export default function WithAuth(
  WrappedComponent: () => React.JSX.Element,
  redirectURI?: string
) {
  function Auth() {
    const [user, setUser] = useState<Models.User<Models.Preferences>>();
    const router = useRouter();
    const setUserFromStore = useStore((state) => state.setUser);

    useEffect(() => {
      (async () => {
        // checks if the user session exists in the appwrite sessions table
        try {
          const user = await appwriteAccount.get();
          setUser(user);

          const { href: avatarImgSrc } = appwriteAvatars.getInitials();

          const isAuthor = await checkRoles("Authors");

          // adding/updating the user data in the global state
          setUserFromStore({
            userId: user.$id,
            avatarImgSrc,
            name: user.name,
            isAuthor,
          });
        } catch (err) {
          router.push(redirectURI || "/login");
          console.error(err);
          setUser(undefined);
        }
      })();
    }, []);

    return user && <WrappedComponent />;
  }
  return Auth;
}
