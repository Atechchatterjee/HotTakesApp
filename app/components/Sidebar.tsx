import { useStore } from "store";
import UserAvatar from "./UserAvatar";
import { sora } from "app/fonts";
import Button from "./Button";

export default function Sidebar() {
  const { name, isAuthor, avatarImgSrc } = useStore((state) => ({
    userId: state.user.userId,
    name: state.user.name,
    avatarImgSrc: state.user.avatarImgSrc,
    isAuthor: state.user.isAuthor,
  }));

  return (
    <div className="fixed m-0 flex h-[100svh] w-[20%] min-w-[10rem] flex-col overflow-clip bg-secondary">
      <div className="ml-auto mr-auto flex w-[80%] gap-5 pt-[2em]">
        <UserAvatar
          avatarImgSrc={avatarImgSrc}
          className="xs:h-[1em] xs:w-[1em] h-[4em] w-[4em] sm:h-[2em] sm:w-[2em] md:h-[3em] md:w-[3em] lg:h-[4em] lg:w-[4em]"
        />
        <div className="flex flex-col flex-wrap gap-1 self-center break-all">
          <h2
            className={`${sora.className} xs:text-[90%] font-semibold sm:text-[110%] md:text-[150%] lg:text-[170%]`}
          >
            {name}
          </h2>
          <p className="xs:text-[75%] sm:text-[80%] md:text-[90%] lg:text-[100%]">
            {isAuthor ? "Author" : "Normie"}
          </p>
        </div>
      </div>
    </div>
  );
}
