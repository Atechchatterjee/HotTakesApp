import { Sora } from "next/font/google";
import React from "react";

const sora = Sora({ subsets: ["latin"], weight: ["400", "800"] });

const FeatureCard = ({
  title,
  desc,
  iconSrc,
}: {
  title: string;
  desc: string;
  iconSrc: string;
}) => {
  return (
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
};

export default FeatureCard;
