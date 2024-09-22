import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const TaskSkeleton = () => {
  return (
    <Card className="">
      <Skeleton className="h-40 mx-3 mt-3 rounded-xl" />

      <div class="mt-4 px-5 pb-5">
        <Skeleton className="h-8" />

        <div class=" mt-2 mb-5">
          <Skeleton className="h-5" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
      </div>
    </Card>
  );
};

export default TaskSkeleton;
