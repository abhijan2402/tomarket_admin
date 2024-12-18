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
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
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

export default function AddTask({ refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);

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
      reward: Yup.number()
        .required("Reward is required")
        .min(0.2, "Reward must be at least 0.2"),
      link: Yup.string().url("Invalid URL").required("Link is required"),
      type: Yup.string().required("Type is required"),
      category: Yup.string().required("Category is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let platformLogo = values.type;

        if (values.type === "other" && imageFile) {
          const storageRef = ref(storage, `platformLogo/${imageFile.name}-${Date.now()}`);
          const uploadResult = await uploadBytes(storageRef, imageFile);
          platformLogo = await getDownloadURL(uploadResult.ref);
        }

        await addDoc(collection(db, "singletasks"), {
          title: values.title,
          description: values.description,
          reward: values.reward,
          link: values.link,
          type: "single",
          category: values.category,
          platformLogo,
          createdAt: serverTimestamp(),
          createdBy: "admin",
          status: "pending",
        });

        resetForm();
        setImageFile(null);
        refetch();
        setIsOpen(false);
        toast.success("Task added successfully");
      } catch (error) {
        console.error("Error adding document: ", error);
        toast.error("Error while adding task! Please try again");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setFieldValue("description", value);
      setDescriptionCount(value.length);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

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
              onValueChange={(value) => {
                setFieldValue("type", value);
                if (value !== "other") setImageFile(null);
              }}
            >
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
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {touched.type && errors.type ? (
              <div className="text-red-500 text-sm mt-1">{errors.type}</div>
            ) : null}
          </div>

          {values.type === "other" && (
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border"
              />
              {imageFile && (
                <div className="text-sm text-gray-500 mt-1">
                  Selected: {imageFile.name}
                </div>
              )}
            </div>
          )}

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
