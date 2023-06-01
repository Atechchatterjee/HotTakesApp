import { Avatar, AvatarImage, AvatarImageProps } from "@radix-ui/react-avatar";
import clsx from "clsx";

interface UserAvatarProps extends AvatarImageProps {
  avatarImgSrc: string;
  clickable?: boolean;
}

export default function UserAvatar({
  avatarImgSrc,
  clickable,
  className,
  ...props
}: UserAvatarProps) {
  return (
    <img
      src={avatarImgSrc}
      className={clsx(
        "h-[2em] w-[2em]",
        clickable && "cursor-pointer",
        "select-none rounded-full",
        className
      )}
      {...props}
    />
  );
}
