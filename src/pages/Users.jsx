import { useState } from "react";
import { Checkbox } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

const fetchUsers = async () => {
  const usersQuery = query(
    collection(db, "users"),
    where("role", "==", "user")
  );
  const querySnapshot = await getDocs(usersQuery);
  const users = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return users;
};

export default function Users() {
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 300000,
  });

  const handleToggleActiveStatus = async (user, bulk = false) => {
    try {
      setLoading(true);

      if (bulk) {
        const promises = selectedUsers.map(async (selectedUser) => {
          const userRef = doc(db, "users", selectedUser.id);
          await updateDoc(userRef, {
            isActive: !selectedUser.isActive,
          });
        });
        await Promise.all(promises);
        toast.success(
          `Users ${
            selectedUsers[0]?.isActive ? "deactivated" : "activated"
          } successfully`
        );
      } else {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
          isActive: !user.isActive,
        });
        toast.success(
          `User ${user.isActive ? "deactivated" : "activated"} successfully`
        );
      }

      refetch();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error updating admin status: ", error);
      toast.error("Failed to update admin status.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users);
    }
    setSelectAll(!selectAll);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
        {selectedUsers.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleToggleActiveStatus(null, true)}
              disabled={loading}
            >
              {/* {selectedUsers[0]?.isActive ? "Deactivate Selected" : "Activate Selected"} */}
              Change Status
            </Button>
          </div>
        )}
      </div>

      <div className="w-[350px] md:w-auto overflow-x-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <Table className="w-full overflow-auto">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user)}
                      onChange={() => handleSelectUser(user)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="font-medium capitalize">
                    {user.role?.split("-").join(" ")}
                  </TableCell>
                  <TableCell className="font-medium capitalize">
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Deactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleToggleActiveStatus(user)}
                      disabled={loading}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
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
