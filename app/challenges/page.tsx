"use client";
import WithAuth from "app/components/WithAuth";
import Sidebar from "../components/Sidebar";

function Challenges() {
  return (
    <>
      <Sidebar />
      <div className="flex w-[80%] flex-col gap-10 pl-[30%] pt-[2%]">
        <h1>Challenges</h1>
      </div>
    </>
  );
}

export default () => <WithAuth WrappedComponent={Challenges} />;
