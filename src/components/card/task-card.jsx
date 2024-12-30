import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Trash } from "lucide-react";
import EditTask from "../edit-task";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import EditGroupTask from "../edit-group-task";
import { useAuth } from "@/context/AuthContext";
import Details from "../Details";

const TaskCard = ({ data, refetch }) => {
  const { user } = useAuth();
  const getImage = (type) => {
    console.log(type);
    return type?.toLowerCase() === "twitter"
      ? "/images/twitter.jpg"
      : type?.toLowerCase() === "youtube"
      ? "/images/youtube.jpg"
      : type?.toLowerCase() === "instagram"
      ? "/images/insta.avif"
      : type?.toLowerCase() === "facebook"
      ? "/images/Facebook.jpg"
      : type;
  };

  const [approveLoader, setApproveLoader] = useState(false);
  const [rejectLoader, setRejectLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const handleApprove = async (taskId, dbname) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this task?"
    );
    if (confirmed) {
      try {
        setApproveLoader(true);
        const taskDocRef = doc(db, dbname, taskId);
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

  const handleDelete = async (taskId, dbname) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmed) {
      try {
        setDeleteLoader(true);
        const taskDocRef = doc(db, dbname, taskId);
        await deleteDoc(taskDocRef);
        refetch();
        console.log(`Task with ID: ${taskId} has been deleted.`);
      } catch (error) {
        console.error("Error deleting task:", error);
      } finally {
        setDeleteLoader((prevState) => false);
      }
    }
  };

  const handleReject = async (taskId, dbname) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this task?"
    );
    if (confirmed) {
      try {
        setRejectLoader(true);
        const taskDocRef = doc(db, dbname, taskId);
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
      {data?.tasks?.length ? (
        <Carousel className="w-full">
          <CarouselContent>
            {data?.tasks?.map((item, index) => (
              <CarouselItem key={index}>
                <div className="w-full">
                  <div className="relative mx-3 mt-3 flex   h-40 overflow-hidden rounded-xl">
                    <img
                      className="object-cover w-full"
                      src={data.thumbnail ||"/images/all.webp"}
                      alt="product image"
                    />
                    <span
                      className={cn(
                        data?.status === "pending"
                          ? "bg-black"
                          : data?.status === "rejected"
                          ? "bg-destructive"
                          : "bg-green-600",
                        "absolute top-0 left-0 m-2 rounded-full px-2 text-center text-sm font-medium text-white capitalize"
                      )}
                    >
                      {data?.status}
                    </span>
                  </div>

                  <div className="px-5 mt-2 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-blue-800 font-bold  bg-gray-200 px-2 py-1 ">
                        {item?.category || "Group"}
                      </span>
                    </div>

                    {user.id === data?.createdBy && (
                      <div className="top-0 right-0 flex gap-2">
                        <EditGroupTask data={data} refetch={refetch} />

                        <Button
                          disabled={deleteLoader}
                          size="icon"
                          className="shadow-sm rounded-full"
                          variant="destructive"
                          onClick={() => handleDelete(data?.id, "tasks")}
                        >
                          {deleteLoader ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="mt-1 px-5 ">
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
              src={
                getImage(data?.platformLogo)
              }
              alt="product image"
            />
            <span
              className={cn(
                data?.status === "pending"
                  ? "bg-black"
                  : data?.status === "rejected"
                  ? "bg-destructive"
                  : "bg-green-600",
                "absolute top-0 left-0 m-2 rounded-full px-2 text-center text-sm font-medium text-white capitalize"
              )}
            >
              {data?.status}
            </span>
          </a>

          <div className="px-5 mt-2 flex justify-between items-center">
            {data?.category ? (
              <div>
                <span className="text-xs text-blue-800 font-bold  bg-gray-200 px-2 py-1 ">
                  {data?.category}
                </span>
              </div>
            ) : (
              <div></div>
            )}

            {user.id === data?.createdBy && (
              <div className="flex gap-2">
                <EditTask data={data} refetch={refetch} />

                <Button
                  size="icon"
                  className="shadow-sm rounded-full"
                  variant="destructive"
                  onClick={() => handleDelete(data?.id, "singletasks")}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-1 mb-4 px-5 ">
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

            {user.id === data?.createdBy && (
              <Details data={data} refetch={refetch} />
            )}
          </div>
        </>
      )}

      {data.status === "pending" ? (
        <div className="pb-5 mt-auto px-5">
          <div className="grid grid-cols-2 gap-3">
            <Button
              disabled={data?.status === "rejected" || rejectLoader}
              variant="destructive"
              onClick={() =>
                handleReject(
                  data?.id,
                  data?.tasks?.length ? "tasks" : "singletasks"
                )
              }
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
              onClick={() =>
                handleApprove(
                  data?.id,
                  data?.tasks?.length ? "tasks" : "singletasks"
                )
              }
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
      ) : null}
    </Card>
  );
};

export default TaskCard;
