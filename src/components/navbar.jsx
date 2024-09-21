import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import React from 'react'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { BadgeDollarSign, CircleUser, CircleUserIcon, LogOut, Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { NAV_LINKS } from '@/constant/nav-links'
import { cn } from '@/lib/utils'

const Navbar = () => {
    const { pathname } = useLocation();

  const isActive = (path) => {
    return pathname === path;
  };
  return (
    <header className="flex sticky z-20 top-0 h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
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
          >
            <BadgeDollarSign className="h-6 w-6" />
            <span>ToMarket Amdin</span>
          </Link>

          {NAV_LINKS.map((link, i) => (
            <Link
              to={link.path}
              className={cn(
                isActive(link.path)
                  ? "bg-muted text-primary"
                  : "text-muted-foreground ",
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
              )}
            >
              {link.icon()}
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Button className="w-full">
            Logout <LogOut className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
    <div className="w-full flex-1">
      {/* <form>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          />
        </div>
      </form> */}
    </div>
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
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </header>
  )
}

export default Navbar