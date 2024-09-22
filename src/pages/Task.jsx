import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/card/task-card";
import AddTask from "@/components/add-task";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TaskSkeleton from "@/components/skeleton/TaskSkeleton";

const fetchTasks = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
};

export default function Task() {
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 300000, // 5 minutes
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Task</h1>
        <AddTask refetch={refetch} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-7">
          {Array.from({ length: 6 }).map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      ) : tasks.length ? (
        <div className="grid grid-cols-3 gap-7">
          {tasks.map((task) => (
            <TaskCard key={task.id} data={task} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-1 items-center justify-center p-4 rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No Tasks Available
            </h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating a task to manage your workflow.
            </p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" /> Add Task
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
