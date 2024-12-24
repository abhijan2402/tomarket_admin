import React, { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

const LogoUploadForm = () => {
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [currentLogoURL, setCurrentLogoURL] = useState("");
  const [prevLogo, setPrevLogo] = useState(false)
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "settings", "LOGO");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentLogoURL(docSnap.data().value);
          setPrevLogo(true)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setLogo(selectedFile);
    if (selectedFile) {
      setLogoPreview(URL.createObjectURL(selectedFile));
    }
  };

  // const handleUpload = async () => {
  //   if (!logo) {
  //     alert("Please select a logo image to upload.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     if (currentLogoURL) {
  //       const oldLogoRef = ref(storage, currentLogoURL);
  //       await deleteObject(oldLogoRef);
  //     }

  //     const logoRef = ref(storage, `logos/${logo.name}`);

  //     await uploadBytes(logoRef, logo);

  //     const downloadURL = await getDownloadURL(logoRef);
  //     const logoDocRef = doc(db, "settings", "LOGO");
  //     await setDoc(logoDocRef, { type: "LOGO", value: downloadURL });

  //     setCurrentLogoURL(downloadURL);
  //     setPrevLogo(true)
  //     setLogo(null);
  //     setLogoPreview(null);
  //     toast.success("Logo uploaded successfully!");
  //   } catch (error) {
  //     console.error("Error uploading logo:", error);
  //     toast.error("Failed to upload logo. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpload = async () => {
    if (!logo) {
      alert("Please select a logo image to upload.");
      return;
    }
  
    setLoading(true);
    try {
      if (currentLogoURL) {
        const oldLogoRef = ref(storage, new URL(currentLogoURL).pathname.substring(1));
        try {
          await deleteObject(oldLogoRef);
        } catch (error) {
          if (error.code === "storage/object-not-found") {
            console.warn("No previous logo found to delete.");
          } else {
            throw error;
          }
        }
      }
  
      const logoRef = ref(storage, `logos/${logo.name}`);
      await uploadBytes(logoRef, logo);
      const downloadURL = await getDownloadURL(logoRef);
  
      const logoDocRef = doc(db, "settings", "LOGO");
      await setDoc(logoDocRef, { type: "LOGO", value: downloadURL });
  
      setCurrentLogoURL(downloadURL);
      setPrevLogo(true);
      setLogo(null);
      setLogoPreview(null);
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Logo Management</h1>
      </div>

      {isLoading ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7">
          <Card className="aspect-square p-5">
            <Skeleton className="w-full h-full" />
          </Card>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7">
          {prevLogo ? (
            <Card className="aspect-square p-5 relative">
              <img
                className="w-full h-full object-cover"
                src={currentLogoURL}
                alt=""
              />

              <div className="absolute top-2 right-2">
                <Button onClick={() => setPrevLogo(false)} size="icon" className="shadow-sm rounded-full">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="aspect-square">
              <div className="file-upload-container h-[85%] flex justify-center items-center">
                <input
                  accept="image/*"
                  multiple
                  type="file"
                  style={{ display: "none" }}
                  id="file-upload-input"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload-input"
                  className="w-full h-full flex justify-center items-center"
                >
                  {logoPreview ? (
                    <img
                      className="w-[70%] aspect-square object-cover"
                      src={logoPreview}
                      alt="no-image"
                    />
                  ) : (
                    <img
                      className="w-[50%] aspect-square object-cover"
                      src={"/plus.svg"}
                      alt="no-image"
                    />
                  )}
                </label>
              </div>

              <div className="w-[80%] mx-auto mb-4">
                <Button
                  disabled={loading || !logo}
                  onClick={handleUpload}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />{" "}
                      Uplading...
                    </>
                  ) : (
                    "Upload Logo"
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoUploadForm;
