"use client";
import React, { useEffect } from "react";
import WithAuth from "app/components/WithAuth";
import { useStore } from "store";
import Sidebar from "app/components/Sidebar";
import NewDiscussionDialog from "app/components/NewDiscussionDialog";

export default WithAuth(function Dashboard() {
  const { user, setUser } = useStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  useEffect(() => {
    console.log({ user, setUser });
  }, []);

  return (
    <>
      <Sidebar />
      <div className="ml-[25%]">
        <NewDiscussionDialog />
      </div>
    </>
  );
});
