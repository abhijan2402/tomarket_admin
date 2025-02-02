import TaskCard from "@/components/card/task-card";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TaskSkeleton from "@/components/skeleton/TaskSkeleton";
import { Box, Tab, Tabs } from "@mui/material";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import AddGroupTask from "@/components/add-group-task";
import { useAuth } from "@/context/AuthContext";


const fetchTasks = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });

  items.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
  return items;
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Task() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = parseInt(searchParams.get("tab") || "0", 10);

  const { theme } = useTheme();

  const [value, setValue] = useState(defaultTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchParams({ tab: newValue });
  };

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 300000,
  });

  const filteredTasks = useMemo(() => {
    if (value === 0) {
      return tasks.filter((task) => task.createdBy === user?.id);
    }
    else if (value === 1) {
      return tasks.filter((task) => task.status === "pending" && task.createdBy !== user?.id);
    } else if (value === 2) {
      return tasks.filter((task) => task.status === "approved" && task.createdBy !== user?.id);
    } else if (value === 3) {
      return tasks.filter((task) => task.status === "rejected" && task.createdBy !== user?.id);
    }

    return tasks;
  }, [tasks, value]);

  const renderTasks = (refetch) => {
    if (isLoading) {
      return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7">
          {Array.from({ length: 6 }).map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!filteredTasks.length) {
      return (
        <div className="flex flex-1 items-center justify-center p-4 rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No Tasks Available
            </h3>
          </div>
        </div>
      );
    }

    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} data={task} refetch={refetch} />
        ))}
      </div>
    );
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Multi Task</h1>

        <AddGroupTask refetch={refetch} />
      </div>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="task status tabs"
        >
          <Tab
            sx={{ color: theme === "dark" ? "white" : "" }}
            label="My Task"
            {...a11yProps(0)}
          />
          <Tab
            sx={{ color: theme === "dark" ? "white" : "" }}
            label="Pending"
            {...a11yProps(1)}
          />
          <Tab
            sx={{ color: theme === "dark" ? "white" : "" }}
            label="Approved"
            {...a11yProps(2)}
          />
          <Tab
            sx={{ color: theme === "dark" ? "white" : "" }}
            label="Rejected"
            {...a11yProps(3)}
          />

       
        </Tabs>
      </Box>

     
      <CustomTabPanel value={value} index={0}>
        {renderTasks(refetch)}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {renderTasks(refetch)}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {renderTasks(refetch)}
      </CustomTabPanel>

    
    </main>
  );
}
