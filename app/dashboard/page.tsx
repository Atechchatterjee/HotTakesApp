"use client";
import React from "react";
import WithAuth from "app/components/WithAuth";

const Dashboard = () => {
  return <h1>Welcome to Dashboard</h1>;
};

export default WithAuth(Dashboard);
