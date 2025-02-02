import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Check, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SupportQuery = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  const collectionRef = collection(db, "queries");

  // Fetch existing queries on component mount
  useEffect(() => {
    const fetchQueries = async () => {
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQueries(data);
    };
    fetchQueries();
  }, []);

  const handleResolve = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this query as resolved?"
    );

    if (!confirmed) return;
    setLoading(true);
    try {
      const queryRef = doc(db, "queries", id);
      await updateDoc(queryRef, {
        status: "resolved",
      });
      // Reload queries after status update
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQueries(data);
    } catch (error) {
      console.error("Error updating query: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Support Queries</h1>
      </div>

      {/* Display Existing Queries */}
      <Card className="w-full overflow-auto">
        <CardContent className="pt-5">
          <div className="overflow-x-auto max-h-96 max-w-[400px] md:max-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Title</TableHead>
                  <TableHead className="min-w-[250px]">Description</TableHead>
                  <TableHead className="min-w-[150px]">User</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "pending" ? "secondary" : "default"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-end gap-4">
                      {/* Mail Button */}
                      <Button size="icon" variant="outline">
                        <a
                          href={`mailto:${item.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </Button>

                      {/* Check Button (Resolve the query) */}
                      <Button
                        size="icon"
                        onClick={() => handleResolve(item.id)}
                        disabled={loading}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportQuery;
