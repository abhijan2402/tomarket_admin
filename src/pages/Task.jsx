import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Task() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Task</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Task
        </Button>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
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
    </main>
  );
}
