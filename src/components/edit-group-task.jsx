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
import { Edit, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
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

export default function EditGroupTask({ refetch, data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState(data?.tasks || []);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [description, setDescription] = useState(data?.description || "");
  const [thumbnail, setThumbnail] = useState(null);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [numberOfParticipants, setNumberOfParticipants] = useState(data?.numberOfParticipants || 0);
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
      reward: Yup.number().required("Reward is required"),
      link: Yup.string().url("Invalid URL").required("Link is required"),
      type: Yup.string().required("Type is required"),
    }),
    onSubmit: async (values) => {
      if (editIndex !== null) {
        // Update the existing task
        setTasks((prev) =>
          prev.map((task, index) =>
            index === editIndex ? { ...task, ...values } : task
          )
        );
        setEditIndex(null);
      } else {
        let platformLogo = values.type;

        // Handle file upload for "Other" type
        if (values.type === "other" && imageFile) {
          try {
            const storageRef = ref(
              storage,
              `platformLogo/${imageFile.name}-${Date.now()}`
            );
            const snapshot = await uploadBytes(storageRef, imageFile);
            platformLogo = await getDownloadURL(snapshot.ref);
          } catch (error) {
            console.error("Error uploading file: ", error);
            toast.error("Failed to upload image. Please try again.");
            return;
          }
        }

        // Add a new task
        setTasks((prev) => [
          ...prev,
          {
            title: values.title,
            reward: values.reward,
            link: values.link,
            platformLogo,
          },
        ]);
      }

      resetForm();
      setIsEdit(false);
    },
  });

  const handleEdit = (index) => {
    const taskToEdit = tasks[index];
    setEditIndex(index);
    setFieldValue("title", taskToEdit.title);
    setFieldValue("description", taskToEdit.description);
    setFieldValue("reward", taskToEdit.reward);
    setFieldValue("link", taskToEdit.link);
    setFieldValue("category", taskToEdit.category);
    setFieldValue("type", taskToEdit.platformLogo);
    setIsEdit(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const taskRef = doc(db, "tasks", data.id);

      if (thumbnail) {
        const storageRef = ref(
          storage,
          `thumbnail/${thumbnail.name}-${Date.now()}`
        );
        const uploadResult = await uploadBytes(storageRef, thumbnail);
        const thumbnailUrl = await getDownloadURL(uploadResult.ref);
        await updateDoc(taskRef, {
          thumbnail: thumbnailUrl,
          numberOfParticipants,
          description,
          tasks,
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(taskRef, {
          description,
          numberOfParticipants,
          tasks,
          updatedAt: serverTimestamp(),
        });
      }

      toast.success("Task updated successfully");

      setTasks([]);
      refetch();
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error while adding task! Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setDescription(value);
      setDescriptionCount(value.length);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

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
          <DialogTitle>Edit Group Task</DialogTitle>
        </DialogHeader>

        <div>
          <Textarea
            name="description"
            type="text"
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
            className={cn(
              touched.description && errors.description ? "border-red-500" : ""
            )}
          />
          <div className="flex justify-between">
            <div className="text-sm text-gray-500 mt-1">
              {descriptionCount}/500 characters
            </div>
          </div>
        </div>

        <div>
            <Input
              name="numberOfParticipants"
              type="text"
              placeholder="numberOfParticipants"
             
              value={numberOfParticipants}
              onChange={(e) => setNumberOfParticipants(e.target.value)}
            />
         
          </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="mt-1"
          />
        </div>

        {tasks?.length ? (
          <div className="border border-primary p-2 rounded-md">
            {tasks.map((item, i) => (
              <div key={i} className="flex justify-between border-b p-2">
                {item.title}
                <div>
                  <Button
                    onClick={() => handleEdit(i)}
                    size="icon"
                    className="mr-2"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>{" "}
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
              </div>
            ))}

            <div>
              <Button
                className="w-full mt-5"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                    Updating...
                  </>
                ) : (
                  "Update Group Tasks"
                )}
              </Button>
            </div>
          </div>
        ) : null}

        {isEdit ? (
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
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {touched.type && errors.type && (
                <div className="text-red-500 text-sm mt-1">{errors.type}</div>
              )}
            </div>

            {/* File Input for 'Other' */}
            {values.type === "other" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Platform Logo
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                    Updating...
                  </>
                ) : (
                  "Update Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
