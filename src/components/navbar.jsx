import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  BadgeDollarSign,
  CircleUserIcon,
  LogOut,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { NAV_LINKS } from "@/constant/nav-links";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isActive = (path) => {
    return pathname === path;
  };

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="flex sticky z-20 top-0 h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setIsSheetOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={handleLinkClick} // Close the Sheet on click
            >
              <BadgeDollarSign className="h-6 w-6" />
              <span>ToMarket Admin</span>
            </Link>
        
            {NAV_LINKS.map((link, i) =>
              link.label === "Admins" && user.role !== "super-admin" ? null : (
                <Link
                  key={i}
                  to={link.path}
                  className={cn(
                    isActive(link.path)
                      ? "bg-muted text-primary"
                      : "text-muted-foreground ",
                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
                  )}
                  onClick={handleLinkClick}
                >
                  {link.icon()}
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="mt-auto">
            <Button className="w-full" onClick={logout}>
              Logout <LogOut className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1"></div>
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUserIcon className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
       
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Navbar;
