import React from "react";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";
import { Card } from "../ui/card";

const TaskCard = ({ data }) => {
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
  return (
    <Card>
      <a
        class="relative mx-3 mt-3 flex h-40 overflow-hidden rounded-xl"
        href="#"
      >
        <img
          class="object-cover w-full"
          src={getImage(data?.type)}
          alt="product image"
        />
        <span class="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
          Badge
        </span>
      </a>
      <div class="mt-4 px-5 pb-5">
        <a href="#">
          <h5 class="text-xl font-medium tracking-tight text-slate-900 dark:text-slate-100 tigh truncate">
            {data?.title}
          </h5>
        </a>
        <div class=" mt-2 mb-5 flex items-center justify-between">
          <p class=" text-sm tracking-tight text-slate-600 dark:text-slate-300 tigh">
            {data?.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-slate-900 hover:bg-gray-700 dark:hover:bg-[#ebeaea] dark:bg-[#FAFAFA] dark:text-[#18181B]">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive">
            <Trash className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;

{
  /* <Card class="relative flex w-full max-w-xs flex-col overflow-hidden shadow-md"></Card> */
}
