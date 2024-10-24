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
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AddCategory({ refetch }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    values,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      position: "", // Added position to initial values
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
      position: Yup.number()
        .required("Position is required")
        .typeError("Position must be a number"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await addDoc(collection(db, "categories"), {
          name: values.name,
          position: values.position, // Adding position field
          createdAt: serverTimestamp(),
          createdBy: "admin",
        });

        resetForm();
        refetch();
        setIsOpen(false);
        toast.success("Category added successfully");
      } catch (error) {
        console.error("Error adding document: ", error);
        toast.error("Error while adding category! Please try again");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div>
            <Input
              name="name"
              type="text"
              placeholder="Category Name"
              className={cn(
                touched.name && errors.name ? "border-red-500" : ""
              )}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && errors.name ? (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            ) : null}
          </div>

          {/* Input field for position */}
          <div>
            <Input
              name="position"
              type="number"
              placeholder="Position"
              className={cn(
                touched.position && errors.position ? "border-red-500" : ""
              )}
              value={values.position}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.position && errors.position ? (
              <div className="text-red-500 text-sm mt-1">
                {errors.position}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Adding...
                </>
              ) : (
                "Add Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
