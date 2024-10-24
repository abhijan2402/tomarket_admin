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
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

export default function EditCategory({ refetch, data }) {
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
      name: data?.name || "",
      position: data?.position || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
      position: Yup.number()
        .required("Position is required")
        .typeError("Position must be a number"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const categoryDoc = doc(db, "categories", data.id);

        await updateDoc(categoryDoc, {
          name: values.name,
          position: values.position,
        });

        resetForm();
        refetch();
        setIsOpen(false);
        toast.success("Category updated successfully");
      } catch (error) {
        console.error("Error updating document: ", error);
        toast.error("Error while updating category! Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" onClick={() => setIsOpen(true)}>
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div>
            <Input
              name="name"
              type="text"
              placeholder="Category Name"
              className={cn(touched.name && errors.name ? "border-red-500" : "")}
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
              <div className="text-red-500 text-sm mt-1">{errors.position}</div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...
                </>
              ) : (
                "Update Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
