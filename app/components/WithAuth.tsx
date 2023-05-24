import { useEffect } from "react";
import { appwriteAccount, appwriteClient } from "utils/appwriteConfig";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Account } from "appwrite";

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
          .catch((err) => {
            router.push(redirectURI || "/login");
            console.error(err);
            setAuthenticated(false);
          });
      })();
    }, [authenticated]);

    return authenticated && <WrappedComponent />;
  };

export default WithAuth;
