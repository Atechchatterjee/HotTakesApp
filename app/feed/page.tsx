"use client";
import WithAuth from "app/components/WithAuth";
import Sidebar from "../components/Sidebar";

function Feed() {
  return (
    <>
      <Sidebar />
      <div className="flex w-[80%] flex-col gap-10 pl-[30%] pt-[2%]">
        <h1>Feed</h1>
      </div>
    </>
  );
}

export default () => <WithAuth WrappedComponent={Feed} />;
