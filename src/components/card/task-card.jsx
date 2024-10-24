import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Edit, Loader2, Trash } from "lucide-react";
import EditTask from "../edit-task";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const TaskCard = ({ data, refetch }) => {
  const getImage = (type) => {
    return type === "twitter"
      ? "/images/twitter.jpg"
      : type === "youtube"
      ? "/images/youtube.jpg"
      : type === "instagram"
      ? "/images/insta.avif"
      : type === "facebook"
      ? "/images/Facebook.jpg"
      : "/images/no-image.jpg";
  };

  const [approveLoader, setApproveLoader] = useState(false);
  const [rejectLoader, setRejectLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const handleApprove = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this task?"
    );
    if (confirmed) {
      try {
        setApproveLoader(true);
        const taskDocRef = doc(db, "tasks", taskId);
        await updateDoc(taskDocRef, {
          status: "approved",
        });
        refetch();
        console.log(`Task with ID: ${taskId} has been approved.`);
      } catch (error) {
        console.error("Error approving task:", error);
      } finally {
        setApproveLoader(false);
      }
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmed) {
      try {
        setDeleteLoader(true);
        const taskDocRef = doc(db, "tasks", taskId);
        await deleteDoc(taskDocRef);
        refetch();
        console.log(`Task with ID: ${taskId} has been deleted.`);
      } catch (error) {
        console.error("Error deleting task:", error);
      } finally {
        setDeleteLoader(false);
      }
    }
  };

  const handleReject = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this task?"
    );
    if (confirmed) {
      try {
        setRejectLoader(true);
        const taskDocRef = doc(db, "tasks", taskId);
        await updateDoc(taskDocRef, {
          status: "rejected",
        });
        refetch();
        console.log(`Task with ID: ${taskId} has been rejected.`);
      } catch (error) {
        console.error("Error rejecting task:", error);
      } finally {
        setRejectLoader(false);
      }
    }
  };

  return (
    <Card>
      <div className="absolute top-0 right-0 m-2 flex gap-2">
        <EditTask data={data} refetch={refetch} />

        <Button
          size="icon"
          className="shadow-sm rounded-full"
          variant="destructive"
          onClick={() => handleDelete(data?.id)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
      {data?.tasks?.length ? (
        <Carousel className="w-full">
          <CarouselContent>
            {data?.tasks?.map((item, index) => (
              <CarouselItem key={index}>
              <div className="w-full">
                <div
                  className="relative mx-3 mt-3 flex   h-40 overflow-hidden rounded-xl"
               
                >
                  <img
                    className="object-cover w-full"
                    src={getImage(item?.type)}
                    alt="product image"
                  />
                  <span
                    className={cn(
                      data?.status === "pending"
                        ? "bg-black"
                        : data?.status === "approved"
                        ? "bg-green-600"
                        : "bg-destructive",
                      "absolute top-0 left-0 m-2 rounded-full px-2 text-center text-sm font-medium text-white capitalize"
                    )}
                  >
                    {item?.status}
                  </span>
                </div>
                <div className="mt-4 px-5 ">
                  <a href="#">
                    <h5 className="text-xl font-medium tracking-tight text-slate-900 dark:text-slate-100 truncate">
                      {item?.title}
                    </h5>
                  </a>
                  <div className="mt-2 mb-5 flex items-center justify-between">
                    <p className="text-sm tracking-tight text-slate-600 dark:text-slate-300 truncate">
                      {item?.description}
                    </p>
                  </div>
                </div>
              </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-5" />
          <CarouselNext className="absolute right-5" />
        </Carousel>
      ) : (
        <>
          <a
            className="relative mx-3 mt-3 flex h-40 overflow-hidden rounded-xl"
            href="#"
          >
            <img
              className="object-cover w-full"
              src={getImage(data?.type)}
              alt="product image"
            />
            <span
              className={cn(
                data?.status === "pending"
                  ? "bg-black"
                  : data?.status === "approved"
                  ? "bg-green-600"
                  : "bg-destructive",
                "absolute top-0 left-0 m-2 rounded-full px-2 text-center text-sm font-medium text-white capitalize"
              )}
            >
              {data?.status}
            </span>

            <div className="absolute top-0 right-0 m-2 flex gap-2">
              <EditTask data={data} refetch={refetch} />

              <Button
                size="icon"
                className="shadow-sm rounded-full"
                variant="destructive"
                onClick={() => handleDelete(data?.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </a>
          <div className="mt-4 px-5 ">
            <a href="#">
              <h5 className="text-xl font-medium tracking-tight text-slate-900 dark:text-slate-100 truncate">
                {data?.title}
              </h5>
            </a>
            <div className="mt-2 mb-5 flex items-center justify-between">
              <p className="text-sm tracking-tight text-slate-600 dark:text-slate-300 truncate">
                {data?.description}
              </p>
            </div>
          </div>
        </>
      )}

      <div className="pb-5 mt-auto px-5">
        <div className="grid grid-cols-2 gap-3">
          <Button
            disabled={data?.status === "rejected" || rejectLoader}
            variant="destructive"
            onClick={() => handleReject(data?.id)}
          >
            {rejectLoader ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              ""
            )}
            Reject
          </Button>
          <Button
            disabled={data?.status === "approved" || approveLoader}
            className="bg-slate-900 hover:bg-gray-700 dark:hover:bg-[#ebeaea] dark:bg-[#FAFAFA] dark:text-[#18181B]"
            onClick={() => handleApprove(data?.id)}
          >
            {approveLoader ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              ""
            )}
            Approve
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
