import AddCategory from "@/components/add-category";
import React, { useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Edit, Loader, Loader2, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditCategory from "@/components/edit-category";

const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(db, "categories"));
  const categories = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return categories.sort((a, b) => a.position - b.position);
};

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    data: categories = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 300000,
  });

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (selectedCategory) {
        await deleteDoc(doc(db, "categories", selectedCategory.id));
        toast.success("Category deleted successfully");
        refetch();
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Error while deleting category! Please try again.");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
      setLoading(false);
    }
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Category</h1>

        <AddCategory refetch={refetch} />
      </div>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.position}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="flex gap-3 justify-end">
                    <EditCategory refetch={refetch} data={category} />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => openDeleteDialog(category)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to delete the category '
            {selectedCategory?.name}'?
          </div>
          <DialogFooter>
            <Button
              disabled={loading}
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              variant="destructive"
              onClick={handleDelete}
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Category;
