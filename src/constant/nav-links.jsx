import { Aperture, CalendarCheck, Home, Megaphone, Table } from "lucide-react";

export const NAV_LINKS = [
  {
    label: "Dashboard",
    icon: () => <Home className="h-4 w-4" />,
    path: "/dashboard",
  },
  {
    label: "Task",
    icon: () => <CalendarCheck className="h-4 w-4" />,
    path: "/dashboard/task",
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
