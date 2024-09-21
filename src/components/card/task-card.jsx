import React from "react";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";

const TaskCard = ({ data }) => {
  return (
    <div class="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <a
        class="relative mx-3 mt-3 flex h-40 overflow-hidden rounded-xl"
        href="#"
      >
        <img class="object-cover w-full" src={data.image} alt="product image" />
        <span class="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
          Badge
        </span>
      </a>
      <div class="mt-4 px-5 pb-5">
        <a href="#">
          <h5 class="text-xl font-medium tracking-tight text-slate-900 tigh truncate">
            {data?.title}
          </h5>
        </a>
        <div class=" mt-2 mb-5 flex items-center justify-between">
          <p class=" text-sm tracking-tight text-slate-600 tigh">
            {data?.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-slate-900 hover:bg-gray-700">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive">
            <Trash className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
