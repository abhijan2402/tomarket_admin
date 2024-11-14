import AddAdmin from "@/components/add-admin";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

const fetchAdmins = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const admins = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return admins;
};

export default function Admins() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user.role !== "super-admin") {
    return <Navigate to="/" />;
  }

  const {
    data: admins = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
    staleTime: 300000,
  });

  // Function to toggle admin activation status
  const handleToggleActiveStatus = async (admin) => {
    try {
      setLoading(true);
      const adminRef = doc(db, "users", admin.id);
      await updateDoc(adminRef, {
        isActive: !admin.isActive,
      });
      toast.success(
        `Admin ${admin.isActive ? "deactivated" : "activated"} successfully`
      );
      refetch(); // Refetch the admin data to update the UI
    } catch (error) {
      console.error("Error updating admin status: ", error);
      toast.error("Failed to update admin status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Admin</h1>
        <AddAdmin />
      </div>

      <div className="w-[350px] md:w-auto  overflow-x-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <Table className="w-full overflow-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell className="font-medium">{admin.email}</TableCell>
                  <TableCell className="font-medium capitalize">
                    {admin.role?.split("-").join(" ")}
                  </TableCell>
                  <TableCell className="font-medium capitalize">
                    <Badge variant={admin.isActive ? "default" : "destructive"}>
                      {admin.isActive ? "Active" : "Deactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-3 justify-end">
                    <Button
                      variant="outlined"
                      onClick={() => handleToggleActiveStatus(admin)}
                      disabled={loading}
                    >
                      {admin.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}
