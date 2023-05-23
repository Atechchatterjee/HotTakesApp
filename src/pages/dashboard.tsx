import React from "react";
import WithAuth from "~/utils/withAuth";

const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to dashboard</h1>
    </div>
  );
};

export default WithAuth(Dashboard);
