import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(db, "categories"));
  const categories = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return categories.sort((a, b) => a.position - b.position);
};

export default function AddGroupTask({ refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 300000,
  });

  const {
    values,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      title: "",
      description: "",
      reward: "",
      link: "",
      type: "",
      category: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      reward: Yup.number().required("Reward is required"),
      link: Yup.string().url("Invalid URL").required("Link is required"),
      type: Yup.string().required("Type is required"),
      category: Yup.string().required("Category is required"),
    }),
    onSubmit: async (values) => {
      setTasks((prev) => [
        ...prev,
        {
          title: values.title,
          description: values.description,
          reward: values.reward,
          link: values.link,
          category: values.category,
          platformLogo: values.type,
        },
      ]);

      resetForm();
      setFieldValue("type", "");
      setFieldValue("category", "");
    },
  });

  const handleAdd = async () => {
    try {
      setLoading(true);
      await addDoc(collection(db, "tasks"), {
        tasks,
        createdAt: serverTimestamp(),
        createdBy: "admin",
        status: "pending",
      });

      setTasks([]);
      refetch();
      setIsOpen(false);
      toast.success("Task added successfully");
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error while adding task! Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Group Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group Task</DialogTitle>
        </DialogHeader>

        {tasks?.length ? (
          <div className="border border-primary p-2 rounded-md">
            {tasks.map((item, i) => (
              <div key={i} className="flex justify-between border-b p-2">
                {item.title}
                <Button
                  onClick={() =>
                    setTasks((prev) => prev.filter((_, index) => index !== i))
                  }
                  size="icon"
                  variant="destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <div>
              <Button
                className="w-full mt-5"
                onClick={handleAdd}
                disabled={loading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Adding...
                  </>
                ) : (
                  "Add Group Tasks"
                )}
              </Button>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div>
            <Input
              name="title"
              type="text"
              placeholder="Title"
              className={cn(
                touched.title && errors.title ? "border-red-500" : ""
              )}
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.title && errors.title && (
              <div className="text-red-500 text-sm mt-1">{errors.title}</div>
            )}
          </div>

          <div>
            <Input
              name="description"
              type="text"
              placeholder="Description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                touched.description && errors.description
                  ? "border-red-500"
                  : ""
              )}
            />
            {touched.description && errors.description && (
              <div className="text-red-500 text-sm mt-1">
                {errors.description}
              </div>
            )}
          </div>

          <div>
            <Input
              name="reward"
              placeholder="Reward"
              className={cn(
                touched.reward && errors.reward ? "border-red-500" : ""
              )}
              value={values.reward}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.reward && errors.reward && (
              <div className="text-red-500 text-sm mt-1">{errors.reward}</div>
            )}
          </div>

          <div>
            <Input
              name="link"
              type="text"
              placeholder="Link"
              className={cn(
                touched.link && errors.link ? "border-red-500" : ""
              )}
              value={values.link}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.link && errors.link && (
              <div className="text-red-500 text-sm mt-1">{errors.link}</div>
            )}
          </div>

          <div>
            <Select onValueChange={(value) => setFieldValue("category", value)}>
              <SelectTrigger
                className={cn(
                  touched.category && errors.category ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {touched.category && errors.category && (
              <div className="text-red-500 text-sm mt-1">{errors.category}</div>
            )}
          </div>

          <div>
            <Select onValueChange={(value) => setFieldValue("type", value)}>
              <SelectTrigger
                className={cn(
                  touched.type && errors.type ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="Select Logo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            {touched.type && errors.type && (
              <div className="text-red-500 text-sm mt-1">{errors.type}</div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Adding...
                </>
              ) : (
                "Add Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}