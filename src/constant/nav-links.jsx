import { Aperture, CalendarCheck, ClipboardList, Home, LayoutDashboard, Megaphone, Table, User, User2, Users, Users2 } from "lucide-react";

export const NAV_LINKS = [
  {
    label: "Dashboard",
    icon: () => <Home className="h-4 w-4" />,
    path: "/dashboard",
  },
  {
    label: "Group Task",
    icon: () => <ClipboardList className="h-4 w-4" />,
    path: "/dashboard/multi-task",
  },
  {
    label: "Single Task",
    icon: () => <CalendarCheck className="h-4 w-4" />,
    path: "/dashboard/single-task",
  },
  {
    label: "Admins",
    icon: () => <Users2 className="h-4 w-4" />,
    path: "/dashboard/admins",
  },
  {
    label: "Users",
    icon: () => <Users className="h-4 w-4" />,
    path: "/dashboard/users",
  },
  {
    label: "Home Layout",
    icon: () => <LayoutDashboard className="h-4 w-4" />,
    path: "/dashboard/home-layout",
  },
  {
    label: "Logo Management",
    icon: () => <Aperture className="h-4 w-4" />,
    path: "/dashboard/logo-management",
  },
  {
    label: "Category",
    icon: () => <Table className="h-4 w-4" />,
    path: "/dashboard/category",
  },
  {
    label: "Advertisement",
    icon: () => <Megaphone className="h-4 w-4" />,
    path: "/dashboard/advertisement",
  },
];
