import { Aperture, CalendarCheck, ClipboardList, Home, LayoutDashboard, Megaphone, Table } from "lucide-react";

export const NAV_LINKS = [
  {
    label: "Dashboard",
    icon: () => <Home className="h-4 w-4" />,
    path: "/dashboard",
  },
  {
    label: "Multi Task",
    icon: () => <ClipboardList className="h-4 w-4" />,
    path: "/dashboard/multi-task",
  },
  {
    label: "Single Task",
    icon: () => <CalendarCheck className="h-4 w-4" />,
    path: "/dashboard/single-task",
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
