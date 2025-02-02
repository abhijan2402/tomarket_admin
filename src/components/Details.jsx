"use client";

import * as React from "react";
import {
  Check,
  Cloud,
  Download,
  Loader2,
  Minus,
  Plus,
  Upload,
  X,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";

export default function Details({ data, refetch, dbname, id }) {
  const [approvedLoading, setApprovedLoading] = React.useState({});
  const [rejectedLoading, setRejectedLoading] = React.useState({});
  const approveProof = async (index) => {
    setApprovedLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const taskDocRef = doc(db, "singletasks", data.id);
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const existingUserTasks = taskDoc.data().userTasks || [];

      existingUserTasks[index].status = "approved";
      existingUserTasks[index].timestamp = new Date();

      await updateDoc(taskDocRef, { userTasks: existingUserTasks });
      refetch();
      toast.success("Approvred successfully!");
    } catch (error) {
      console.error("Failed to claim the task:", error);
      toast.error("Failed to claim the reward.");
    } finally {
      setApprovedLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const rejectProof = async (index) => {
    setRejectedLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const taskDocRef = doc(db, "singletasks", data.id);
      const taskDoc = await getDoc(taskDocRef);

      if (!taskDoc.exists()) {
        toast.error("Task not found.");
        return;
      }

      const existingUserTasks = taskDoc.data().userTasks || [];

      existingUserTasks[index].status = "rejected";
      existingUserTasks[index].timestamp = new Date();

      await updateDoc(taskDocRef, { userTasks: existingUserTasks });
      refetch();
      toast.success("Rejected!");
    } catch (error) {
      console.error("Failed to claim the task:", error);
      toast.error("Failed to claim the reward.");
    } finally {
      setRejectedLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          Details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{data?.title}</DrawerTitle>
            <DrawerDescription>{data?.description}</DrawerDescription>
          </DrawerHeader>

          <hr />
          <div className="p-4 pb-5">
            {data?.userTasks?.length ? (
              data?.userTasks?.map((item, i) => (
                <div className="flex justify-between mb-3">
                  <p>{item.userName}</p>
                  <div className="flex gap-3">
                    {item?.proofUrl ? (
                      <a
                        href={item?.proofUrl}
                        target="_blank"
                        className={cn(
                          buttonVariants({ size: "icon", variant: "secondary" })
                        )}
                      >
                        <Cloud className="w-4 h-4" />
                      </a>
                    ) : null}
                    {item.status === "started" ? (
                      <div
                        className={cn(
                          buttonVariants({ variant: "secondary" }),
                          "capitalize cursor-not-allowed"
                        )}
                      >
                        {item.status}
                      </div>
                    ) : item.status === "submitted" ? (
                      <div className="flex gap-3">
                        <Button
                          disabled={approvedLoading[i] || rejectedLoading[i]}
                          size="icon"
                          variant="destructive"
                          onClick={() => rejectProof(i)}
                        >
                          {rejectedLoading[i] ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          disabled={approvedLoading[i] || rejectedLoading[i]}
                          onClick={() => approveProof(i)}
                          size="icon"
                        >
                          {approvedLoading[i] ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ) : item?.status === "approved" ? (
                      <div
                        className={cn(
                          buttonVariants({}),
                          "capitalize cursor-not-allowed"
                        )}
                      >
                        {item.status}
                      </div>
                    ) : item.status === "rejected" ? (
                      <div
                        className={cn(
                          buttonVariants({ variant: "destructive" }),
                          "capitalize cursor-not-allowed"
                        )}
                      >
                        {item.status}
                      </div>
                    ) : item.status === "claimed" ? (
                      <div
                        className={cn(
                          buttonVariants({}),
                          "capitalize cursor-not-allowed"
                        )}
                      >
                        {item.status}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div>
                <p className="text-center">
                  No users have completed this task yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
