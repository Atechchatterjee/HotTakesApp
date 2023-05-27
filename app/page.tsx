import Head from "next/head";
import Navbar from "app/components/Navbar";
import { Button } from "app/components/ui/button";

import { inter, sora } from "app/fonts";

function FeatureCard({
  title,
  desc,
  illusSource,
}: {
  title: string;
  desc: string;
  illusSource: string;
}) {
  return (
    <div className="relative bg-secondary p-12">
      <img
        src={illusSource}
        alt="illus-source"
        className="absolute right-[44%] mt-[-10em] scale-[100%]"
      />
      <div className="flex flex-col gap-10 rounded-lg ">
        <div className="flex flex-row gap-5 pt-10">
          <h1 className={`${sora.className} justify-center text-3xl font-bold`}>
            {title}
          </h1>
        </div>
        <p className="text-md leading-7">{desc}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Hot Takes App</title>
      </Head>
      <Navbar />
      <div className="absolute z-[-1] mt-[5rem] h-96 w-96 rounded-full bg-primary blur-[14em]" />
      <div className="landing-page flex w-[95%] flex-row gap-10 pt-40">
        <div className="flex flex-col flex-wrap gap-10 pr-40">
          <h1
            className={`${sora.className} bg-gradient-to-r
          from-accent to-white bg-clip-text text-[3.8rem]
font-bold leading-[1.2]  text-transparent 
          `}
          >
            Give Your Hot Takes
            <br />
            on trendiest Tech Topics
          </h1>
          <p className="text-[1.1rem] leading-relaxed">
            Hot Takes App is centred around the concept of building communities
            to host discussions on the trendiest tech topics in this world. Be a
            part of these communities and have your own fair share of hot takes.
          </p>
          <div className="flex flex-wrap gap-5">
            <Button variant="primary" size="xl">
              <div className="flex gap-2">
                <img
                  src="explore-icon.svg"
                  alt="explore-icon"
                  className="scale-75"
                />
                <span className="self-center">Explore</span>
              </div>
            </Button>
            <Button variant="secondary" size="xl">
              Get Started
            </Button>
          </div>
        </div>
        <img
          src="landing-illus.svg"
          alt="landing-illus"
          className="scale-[120%]"
        />
      </div>
      <div className="mb-20 mt-36 flex flex-row gap-10">
        <FeatureCard
          title="Idea behind the App"
          desc="In the current world of ever changing tech, we have quite a lot of interesting topics that we as developers are constantly discussing about. This app for developers to get their opinions and hot-takes about specific topic out and open in the world. It would allow the community to have discussion / debate on various topics and hopefully have fun and learn something more about the tech."
          illusSource="idea-illus.svg"
        />
        <FeatureCard
          title="Key Features"
          desc="
            HotTakes app has two types of user - The Author and The Normie.
            The Authors are capable of hosting discussion of various topics among their communities.
            The Normies are normal users who are part of these communities, who can take part in these discussions and gain credibility points. (gaining credibility point above a set threshold would make them an author). 
          "
          illusSource="feature-illus.svg"
        />
      </div>
    </>
  );
}
