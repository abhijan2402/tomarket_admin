import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/card/task-card";

const tasks = [
  {
    title: "Like Twitter Post to Get Reward",
    image:
      "https://privacyinternational.org/sites/default/files/styles/large/public/2020-07/twitter.jpg?itok=2V1iRPWI",
    description:
      "Like the post on Twitter to earn $5. Follow the steps to claim your reward.",
    reward: "$5",
  },
  {
    title: "Watch YouTube Video to Earn Points",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHXN4oELPRZHP35L_lrBQIzHZsYhfzEUFUag&s",
    description:
      "Watch the entire video on YouTube and earn 50 points. Don't forget to leave a comment!",
    reward: "50 Points",
  },
  {
    title: "Share Instagram Story to Get Bonus",
    image:
      "https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2021/08/instagram_hero_1200_675.png",
    description:
      "Share the story on Instagram and earn a $10 bonus. Make sure to tag our official account!",
    reward: "$10",
  },
  {
    title: "Retweet to Participate in Giveaway",
    image:
      "https://privacyinternational.org/sites/default/files/styles/large/public/2020-07/twitter.jpg?itok=2V1iRPWI",
    description:
      "Retweet the post to enter our giveaway and stand a chance to win $100.",
    reward: "$100",
  },
  {
    title: "Like and Subscribe on YouTube",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHXN4oELPRZHP35L_lrBQIzHZsYhfzEUFUag&s",
    description:
      "Like the video and subscribe to our channel to earn 100 points.",
    reward: "100 Points",
  },
];

export function Task() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Task</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-7">
        {tasks?.map((task, i) => (
          <TaskCard data={task} />
        ))}
      </div>

      {/* <div
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
      </div> */}
    </main>
  );
}
