import { CalendarCheck, Home, Megaphone } from "lucide-react";

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
    label: "Advertisement",
    icon: () => <Megaphone className="h-4 w-4" />,
    path: "/dashboard/advertisement",
  },
];
