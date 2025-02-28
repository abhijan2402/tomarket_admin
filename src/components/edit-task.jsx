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
import { Edit, Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  addDoc,
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
import { Textarea } from "./ui/textarea";

const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(db, "categories"));
  const categories = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return categories.sort((a, b) => a.position - b.position);
};

export default function EditTask({ refetch, data }) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!data?.id;
  const [descriptionCount, setDescriptionCount] = useState(0);

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
      title: data?.title || "",
      description: data?.description || "",
      reward: data?.reward || "",
      link: data?.link || "",
      type: data?.platformLogo || "",
      category: data?.category || "",
      proof: data.proof || "no",
      numberOfParticipants: data.numberOfParticipants || 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      reward: Yup.number().required("Reward is required"),
      link: Yup.string().url("Invalid URL").required("Link is required"),
      type: Yup.string().required("Type is required"),
      category: Yup.string().required("category is required"),
      numberOfParticipants: Yup.number().required("Number Of Participants is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const taskRef = doc(db, "singletasks", data.id);
        await updateDoc(taskRef, {
          title: values.title,
          description: values.description,
          reward: values.reward,
          link: values.link,
          platformLogo: values.type,
          type: "single",
          category: values.category,
          numberOfParticipants: values.numberOfParticipants,
          updatedAt: serverTimestamp(),
        });
        toast.success("Task updated successfully");

        resetForm();
        refetch();
        setIsOpen(false);
      } catch (error) {
        console.error("Error saving document: ", error);
        toast.error("Error while saving task! Please try again");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setFieldValue("description", value);
      
    }
  };

  useEffect(() => {
if(values.description) {
  setDescriptionCount(values.description.length);
}
  }, [values.description])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="shadow-sm rounded-full"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "Add Task"}</DialogTitle>
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
            <Textarea
              name="description"
              type="text"
              placeholder="Description"
              value={values.description}
              onChange={handleDescriptionChange}
              onBlur={handleBlur}
              className={cn(
                touched.description && errors.description
                  ? "border-red-500"
                  : ""
              )}
            />
            <div className="flex justify-between">
              {touched.description && errors.description ? (
                <div className="text-red-500 text-sm mt-1">
                  {errors.description}
                </div>
              ) : null}

              <div></div>

              <div className="text-sm text-gray-500 mt-1">
                {descriptionCount}/500 characters
              </div>
            </div>
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
              name="numberOfParticipants"
              placeholder="Number of Participants"
              className={cn(
                touched.numberOfParticipants && errors.numberOfParticipants ? "border-red-500" : ""
              )}
              value={values.numberOfParticipants}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.numberOfParticipants && errors.numberOfParticipants ? (
              <div className="text-red-500 text-sm mt-1">{errors.numberOfParticipants}</div>
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
            <Select onValueChange={(value) => setFieldValue("category", value)}>
              <SelectTrigger
                className={cn(
                  touched.category && errors.category ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {touched.category && errors.category ? (
              <div className="text-red-500 text-sm mt-1">{errors.category}</div>
            ) : null}
          </div>

          <div>
            <Select
              onValueChange={(value) => setFieldValue("type", value)}
              value={values.type}
            >
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

          <div>
            <Select
              value={values.proof}
              onValueChange={(value) => {
                setFieldValue("proof", value);
              }}
            >
              <SelectTrigger
                className={cn(
                  touched.proof && errors.proof ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="Select Proof" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="screenshot">Screenshot</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>

            {touched.proof && errors.proof ? (
              <div className="text-red-500 text-sm mt-1">{errors.proof}</div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : isEditMode ? (
                "Update Task"
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
