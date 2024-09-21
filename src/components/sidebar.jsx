import { NAV_LINKS } from "@/constant/nav-links";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { BadgeDollarSign, Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
    const { pathname } = useLocation();

    console.log(pathname)

  const isActive = (path) => {
    return pathname === path;
  };
  return (
    <div className="hidden sticky top-0 left-0 bottom-0 h-screen border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <BadgeDollarSign className="h-6 w-6" />
            <span className="">ToMarket Amdin</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {NAV_LINKS.map((link, i) => (
              <Link
                to={link.path}
                className={cn(
                  isActive(link.path)
                    ? "bg-muted text-primary"
                    : "text-muted-foreground ",
                  "flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary"
                )}
              >
                {link.icon()}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button className="w-full">
            Logout <LogOut className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
