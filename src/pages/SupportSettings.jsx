import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

const SupportSettings = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const collectionRef = collection(db, "supportSettings");

  // Fetch existing types on component mount
  useEffect(() => {
    const fetchTypes = async () => {
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTypes(data);

      // Initialize editValues with current types
      const editValuesInit = data.reduce((acc, item) => {
        acc[item.id] = item.type;
        return acc;
      }, {});
      setEditValues(editValuesInit);
    };
    fetchTypes();
  }, []);

  const addType = async () => {
    if (newType.trim() === "") return;
    setLoading(true);
    try {
      const newTypeData = { type: newType };
      const docRef = await addDoc(collectionRef, newTypeData);
      setTypes([...types, { id: docRef.id, ...newTypeData }]);
      setEditValues({ ...editValues, [docRef.id]: newType });
      setNewType("");
      setModalOpen(false); // Close modal after adding
    } finally {
      setLoading(false);
    }
  };

  const saveUpdatedType = async () => {
    if (!currentEditId) return;
    setLoading(true);
    try {
      const updatedType = editValues[currentEditId];
      const docRef = doc(db, "supportSettings", currentEditId);
      await updateDoc(docRef, { type: updatedType });
      setTypes(
        types.map((item) =>
          item.id === currentEditId ? { ...item, type: updatedType } : item
        )
      );
      setModalOpen(false); // Close modal on success
    } finally {
      setLoading(false);
    }
  };

  const deleteType = async (id) => {
    setDeleteLoading({ ...deleteLoading, [id]: true });
    try {
      const docRef = doc(db, "supportSettings", id);
      await deleteDoc(docRef);
      setTypes(types.filter((item) => item.id !== id));
    } finally {
      setDeleteLoading({ ...deleteLoading, [id]: false });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Support Settings</h1>

        <AddEdit
          open={modalOpen}
          setOpen={setModalOpen}
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          onSave={addType}
          loading={loading}
        >
          <Button>Add New Support</Button>
        </AddEdit>
      </div>

      {/* Display Existing Types */}
      <Card>
        <CardContent className="pt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell className="flex justify-end gap-4">
                    <AddEdit
                      open={modalOpen && currentEditId === item.id}
                      setOpen={(isOpen) => {
                        setModalOpen(isOpen);
                        if (!isOpen) setCurrentEditId(null);
                      }}
                      value={editValues[item.id]}
                      onChange={(e) =>
                        setEditValues({ ...editValues, [item.id]: e.target.value })
                      }
                      onSave={saveUpdatedType}
                      loading={loading}
                      editMode
                    >
                      <Button
                        size="icon"
                        onClick={() => {
                          setCurrentEditId(item.id);
                          setModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </AddEdit>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        if (
                          confirm(`Are you sure you want to delete "${item.type}"?`)
                        ) {
                          deleteType(item.id);
                        }
                      }}
                      disabled={deleteLoading[item.id]}
                    >
                      {deleteLoading[item.id] ? (
                        <span>Loading...</span>
                      ) : (
                        <Trash className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const AddEdit = ({
  children,
  open,
  setOpen,
  value,
  onChange,
  onSave,
  loading,
  editMode = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Support" : "Add Support"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Textarea
              value={value}
              onChange={onChange}
              id="name"
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupportSettings;
