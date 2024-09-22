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
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Import your firebase setup
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";

export default function AddTask({refetch}) {
  const [isOpen, setIsOpen] = useState(false);

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
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      reward: Yup.number().required("Reward is required"),
      link: Yup.string().url("Invalid URL").required("Link is required"),
      type: Yup.string().required("Type is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await addDoc(collection(db, "tasks"), {
          title: values.title,
          description: values.description,
          reward: values.reward,
          link: values.link,
          type: values.type,
          createdAt: serverTimestamp(),
          createdBy: "admin",
        });

        resetForm();
        refetch()
        setIsOpen(false);
      } catch (error) {
        console.error("Error adding document: ", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
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
            {touched.title && errors.title ? (
              <div className="text-red-500 text-sm mt-1">{errors.title}</div>
            ) : null}
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
            {touched.description && errors.description ? (
              <div className="text-red-500 text-sm mt-1">
                {errors.description}
              </div>
            ) : null}
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
            {touched.reward && errors.reward ? (
              <div className="text-red-500 text-sm mt-1">{errors.reward}</div>
            ) : null}
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
            {touched.link && errors.link ? (
              <div className="text-red-500 text-sm mt-1">{errors.link}</div>
            ) : null}
          </div>

          <div>
            <Select onValueChange={(value) => setFieldValue("type", value)}>
              <SelectTrigger
                className={cn(
                  touched.type && errors.type ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            {touched.type && errors.type ? (
              <div className="text-red-500 text-sm mt-1">{errors.type}</div>
            ) : null}
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
