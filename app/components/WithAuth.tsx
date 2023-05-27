import { useEffect } from "react";
import { appwriteAccount } from "utils/appwriteConfig";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Wrapper Component to implement protected routes
export default function WithAuth(
  WrappedComponent: () => React.JSX.Element,
  redirectURI?: string
) {
  function Auth() {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
      (async () => {
        // checks if the user session exists in the appwrite sessions table
        await appwriteAccount
          .get()
          .then(() => setAuthenticated(true))
          .catch((err) => {
            router.push(redirectURI || "/login");
            console.error(err);
            setAuthenticated(false);
          });
      })().catch((err) => console.error(err));
    }, [authenticated]);

    return authenticated && <WrappedComponent />;
  }
  return Auth;
}
