import { NextPage } from "next";
import React from "react";
import Navbar from "~/components/Navbar";
import Button from "~/components/util/Button";
import { appwriteAccount } from "~/utils/appwriteConfig";

const Login: NextPage = () => {
  return (
    <>
      <Navbar />
      <Button
        variant="primary"
        onClick={() => {
          try {
            appwriteAccount.createOAuth2Session(
              "github",
              "http://localhost:3000", // success URL
              "http://localhost:3000/login" // failure URL
            );
          } catch (err) {
            console.error("Appwrite Github OAuth Failed!");
          }
        }}
      >
        Github SignIn
      </Button>
    </>
  );
};

export default Login;
