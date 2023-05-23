import { useEffect } from "react";
import { appwriteAccount } from "~/utils/appwriteConfig";
import { useState } from "react";
import { useRouter } from "next/router";

// Wrapper Component to implement protected routes
const WithAuth =
  (WrappedComponent: () => React.JSX.Element, redirectURI?: string) => () => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
      (async () => {
        // checks if the user session exists in the appwrite sessions table
        await appwriteAccount
          .get()
          .then(() => setAuthenticated(true))
          .catch(() => {
            router.push(redirectURI || "/login");
            setAuthenticated(false);
          });
      })();
    }, [authenticated]);

    return authenticated && <WrappedComponent />;
  };

export default WithAuth;
