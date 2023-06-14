"use client";
import { useStore } from "store";
import UserAvatar from "./UserAvatar";
import { inter } from "app/fonts";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LayoutList,
  LucideIcon,
  Swords,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { HTMLAttributes, useEffect, useState } from "react";
import { SelectSeparator } from "./ui/select";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { MdDashboard } from "react-icons/md";
import { GiBattleAxe } from "react-icons/gi";
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import { IoIosPeople } from "react-icons/io";

interface SidebarMenuProps extends HTMLAttributes<HTMLDivElement> {
  text: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
}

function SidebarMenuItem({
  text,
  href,
  icon: Icon,
  active,
  ...props
}: SidebarMenuProps) {
  const router = useRouter();
  return (
    <div
      className={clsx(
        active ? "bg-btn_secondary" : "bg-transparent",
        "flex w-[80%] cursor-pointer gap-7 self-center rounded-lg border-primary pb-3 pl-3 pr-10 pt-3 hover:bg-btn_secondary"
      )}
      {...props}
    >
      <Icon />
      <Link href={href}>{text}</Link>
    </div>
  );
}

type MenuItemType = {
  text: string;
  href: string;
  icon: any;
  ref: "dashboard" | "feed" | "challenges" | "community";
};

const menuItems: MenuItemType[] = [
  {
    text: "Dashboard",
    href: "/dashboard",
    icon: () => <MdDashboard className="h-[1.5rem] w-[1.5rem]" />,
    ref: "dashboard",
  },
  {
    text: "Feed",
    href: "/feed",
    icon: () => <TfiLayoutListThumbAlt className="h-[1.5rem] w-[1.5rem]" />,
    ref: "feed",
  },
  {
    text: "Challenges",
    href: "/challenges",
    icon: () => <GiBattleAxe className="h-[1.5rem] w-[1.5rem]" />,
    ref: "challenges",
  },
  {
    text: "Community",
    href: "/community",
    icon: () => <IoIosPeople className="h-[1.5rem] w-[1.5rem]" />,
    ref: "community",
  },
];

export default function Sidebar({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { name, isAuthor, avatarImgSrc } = useStore((state) => state.user);
  const [menuItemSelected, setMenuItemSelected] = useState<
    Pick<MenuItemType, "ref">
  >({ ref: "dashboard" });
  const [parent, enableAnimations] = useAutoAnimate();

  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMenuItemSelected({
      ref: pathName?.split("/")[1],
    } as Pick<MenuItemType, "ref">);
    enableAnimations(true);
  }, []);

  return (
    <div
      className={clsx(
        "m-0 flex h-[100svh] w-[18%] min-w-[10rem] flex-col overflow-clip bg-secondary",
        className
      )}
      {...props}
    >
      <div className="ml-auto mr-auto flex w-[80%] gap-5 pt-[10%]">
        <UserAvatar
          avatarImgSrc={avatarImgSrc}
          className="xs:h-[1em] xs:w-[1em] h-[3em] w-[3em] sm:h-[1em] sm:w-[1em] md:h-[2em] md:w-[2em] lg:h-[3em] lg:w-[3em]"
        />
        <div className="flex flex-col gap-1 self-center">
          <h2
            className={`${inter.className} xs:text-[90%] text-xl font-semibold`}
          >
            {name}
          </h2>
          <p className="xs:text-[75%] sm:text-[80%] md:text-[90%] lg:text-[100%]">
            {isAuthor ? "Author" : "Normie"}
          </p>
        </div>
      </div>
      <div className="mt-16 flex flex-col gap-3" ref={parent}>
        {menuItems.map(({ text, href, icon, ref }, i) => (
          <SidebarMenuItem
            {...{ text, href, icon }}
            key={i}
            active={menuItemSelected.ref === ref}
            onClick={() => {
              setMenuItemSelected({ ref });
              router.push(href);
            }}
          />
        ))}
      </div>
    </div>
  );
}
