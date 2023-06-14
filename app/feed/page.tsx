"use client";
import WithAuth from "app/components/WithAuth";
import Sidebar from "../components/Sidebar";
import UIWrapper from "app/components/UIWrapper";
import { inter } from "app/fonts";
import DiscussionTopicList from "app/components/DiscussionTopicList";

function Feed() {
  return (
    <UIWrapper className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <h1
          className={`${inter.className} bg-gradient-to-r  from-accent to-white bg-clip-text text-3xl font-bold leading-[1.25] text-transparent`}
        >
          Trendy Discussion Topics
        </h1>
        <p className="text-gray-400">
          These are the trendiest discussions among various communities
        </p>
      </div>
      <DiscussionTopicList className="mb-10 mt-10" allDiscussions />
    </UIWrapper>
  );
}

export default () => <WithAuth WrappedComponent={Feed} />;
