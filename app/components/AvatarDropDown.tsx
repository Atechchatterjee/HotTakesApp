import {
  Keyboard,
  LogOut,
  Settings,
  User,
  LayoutDashboardIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "app/components/ui/dropdown-menu";
import { appwriteAccount } from "utils/appwriteConfig";
import UserAvatar from "./UserAvatar";
import { GiBattleAxe } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import { MdDashboard } from "react-icons/md";

export function AvatarDropDown({ avatarImgSrc }: { avatarImgSrc: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar avatarImgSrc={avatarImgSrc} clickable />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-secondary">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => window.location.assign("/dashboard")}
          >
            <MdDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.assign("/feed")}>
            <TfiLayoutListThumbAlt className="mr-2 h-4 w-4" />
            <span>Login</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.assign("/feed")}>
            <GiBattleAxe className="mr-2 h-4 w-4" />
            <span>Feed</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.location.assign("/challenges")}
          >
            <IoIosPeople className="mr-2 h-4 w-4" />
            <span>Challenges</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            appwriteAccount.deleteSession("current");
            window.location.reload();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
