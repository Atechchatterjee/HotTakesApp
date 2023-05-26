import { type NextPage } from "next";

import Head from "next/head";
import Navbar from "app/components/Navbar";
import Button from "app/components/Button";

import { Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["400", "800"] });

const FeatureCard = ({
  title,
  desc,
  iconSrc,
}: {
  title: string;
  desc: string;
  iconSrc: string;
}) => (
  <div className="flex flex-col gap-10 rounded-lg bg-secondary p-12">
    <div className="flex flex-row gap-5">
      <img src={iconSrc} />
      <h1 className={`${sora.className} text-4xl font-semibold text-accent`}>
        {title}
      </h1>
    </div>
    <p className="text-xl leading-10">{desc}</p>
  </div>
);

const Home: NextPage = () => {
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
            className={`${sora.className} bg-clip-text text-6xl
          font-semibold leading-[1.15] text-transparent text-white
          `}
          >
            Give Your Hot Takes on trendiest Tech Topics
          </h1>
          <p className="text-[1.1rem] leading-relaxed">
            Hot Takes App is centred around the concept of building communities
            to host discussions on the trendiest tech topics in this world. Be a
            part of these communities and have your own fair share of hot takes.
          </p>
          <div className="flex flex-wrap gap-5">
            <Button variant="primary">
              <div className="flex gap-5">
                <img src="explore-icon.svg" alt="explore-icon" />
                Explore
              </div>
            </Button>
            <Button variant="secondary">Get Started</Button>
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
          iconSrc="bulb-icon.svg"
        />
        <FeatureCard
          title="Key Features"
          desc="
            HotTakes app has two types of user - The Author and The Normie.
            The Authors are capable of hosting discussion of various topics among their communities.
            The Normies are normal users who are part of these communities, who can take part in these discussions and gain credibility points. (gaining credibility point above a set threshold would make them an author). 
          "
          iconSrc="key-icon.svg"
        />
      </div>
    </>
  );
};

export default Home;
