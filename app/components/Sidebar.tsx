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
  icon: LucideIcon;
  ref: "dashboard" | "feed" | "challenges" | "community";
};

const menuItems: MenuItemType[] = [
  {
    text: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    ref: "dashboard",
  },
  { text: "Feed", href: "/feed", icon: LayoutList, ref: "feed" },
  { text: "Challenges", href: "/challenges", icon: Swords, ref: "challenges" },
  { text: "Community", href: "/community", icon: Users, ref: "community" },
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
      ref: pathName.split("/")[1],
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
          className="xs:h-[1em] xs:w-[1em] h-[4em] w-[4em] sm:h-[2em] sm:w-[2em] md:h-[3em] md:w-[3em] lg:h-[4em] lg:w-[4em]"
        />
        <div className="flex flex-col gap-1 self-center">
          <h2
            className={`${inter.className} xs:text-[90%] font-semibold sm:text-[105%] md:text-[120%] lg:text-[150%]`}
          >
            {name}
          </h2>
          <p className="xs:text-[75%] sm:text-[80%] md:text-[90%] lg:text-[100%]">
            {isAuthor ? "Author" : "Normie"}
          </p>
        </div>
      </div>
      <SelectSeparator className="mt-10 bg-btn_secondary" />
      <div className="mt-10 flex flex-col gap-3" ref={parent}>
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
