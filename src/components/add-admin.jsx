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
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function AddAdmin({ refetch }) {
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useAuth()

  // Check if the current user is a super-admin
  if (!user || user?.role !== "super-admin") {
    return <p>You do not have permission to add other admins.</p>;
  }

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
      name: "",
      email: "",
      password: "",
      role: "admin", // By default, we set the role as "admin"
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      role: Yup.string().oneOf(["admin", "super-admin"]).required("Role is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Create a new user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const newUser = userCredential.user;

        // Store additional info in Firestore under the "users" collection
        await setDoc(doc(db, "users", newUser.uid), {
          name: values.name,
          email: values.email,
          role: values.role,
          isActive: true,
          createdAt: serverTimestamp(),
          createdBy: user?.id, 
        });

        resetForm();
        refetch();
        setIsOpen(false);
        toast.success(`${values.role} added successfully`);
      } catch (error) {
        console.error("Error adding user: ", error);
        toast.error("Error while adding user! Please try again");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div>
            <Input
              name="name"
              type="text"
              placeholder="Name"
              className={cn(touched.name && errors.name ? "border-red-500" : "")}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && errors.name ? (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            ) : null}
          </div>

          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className={cn(touched.email && errors.email ? "border-red-500" : "")}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email ? (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            ) : null}
          </div>

          <div>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className={cn(touched.password && errors.password ? "border-red-500" : "")}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password ? (
              <div className="text-red-500 text-sm mt-1">{errors.password}</div>
            ) : null}
          </div>

          <div>
            <Select onValueChange={(value) => setFieldValue("role", value)}>
              <SelectTrigger
                className={cn(touched.role && errors.role ? "border-red-500" : "")}
              >
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>

            {touched.role && errors.role ? (
              <div className="text-red-500 text-sm mt-1">{errors.role}</div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Adding...
                </>
              ) : (
                "Add User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
