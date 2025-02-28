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
import { db, storage } from "@/lib/firebase"; // Add storage import for Firebase Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions
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
import { useAuth } from "@/context/AuthContext";

export default function AddGroupTask({ refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [numberOfParticipants, setNumberOfParticipants] = useState(10);

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
      reward: Yup.number()
        .required("Reward is required")
        .min(0.2, "Reward must be at least 0.2"),
      link: Yup.string().url("Invalid URL").required("Link is required"),
      type: Yup.string().required("Type is required"),
    }),
    onSubmit: async (values) => {
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

      setTasks((prev) => [
        ...prev,
        {
          title: values.title,
          reward: values.reward,
          link: values.link,
          platformLogo,
        },
      ]);

      resetForm();
      setDescriptionCount(0);
      setFieldValue("type", "");
      setImageFile(null);
    },
  });

  const handleAdd = async () => {
    try {
      if (!description) {
        return toast.error("Please add a description");
      }

      if (!numberOfParticipants) {
        return toast.error("Please add a Number of Participants");
      }

      if (!thumbnail) {
        return toast.error("Please add a thumbnail");
      }

      setLoading(true);

      const storageRef = ref(
        storage,
        `thumbnail/${thumbnail.name}-${Date.now()}`
      );
      const uploadResult = await uploadBytes(storageRef, thumbnail);
      const thumbnailUrl = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, "tasks"), {
        tasks,
        createdAt: serverTimestamp(),
        createdBy: user.id,
        status: "approved",
        thumbnail: thumbnailUrl,
        description,
        type: "group",
        numberOfParticipants
      });

      setTasks([]);
      setDescription(false);
      setThumbnail(null);
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
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Group Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group Task</DialogTitle>
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
                {loading ? (
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

        <hr />

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Title Input */}
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

          {/* Description Input */}

          {/* Reward Input */}
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

          {/* Link Input */}
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

          {/* Type Select */}
          <div>
            <Select
              value={values.type}
              onValueChange={(value) => setFieldValue("type", value)}
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
            <Button
              type="submit"
              className={cn(
                isSubmitting || !values.title || !values.type
                  ? "cursor-not-allowed opacity-50"
                  : ""
              )}
              disabled={isSubmitting || !values.title || !values.type}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
