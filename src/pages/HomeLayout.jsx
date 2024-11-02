import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const HomeLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [layout, setLayout] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    main_image: "",
    collage_images: [],
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [collageImageFiles, setCollageImageFiles] = useState([null, null]);
  const [collageImagePreviews, setCollageImagePreviews] = useState([
    null,
    null,
  ]);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "layouts", "home-layout");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLayout(data);
          setFormData({
            title: data.title || "",
            description: data.description || "",
            main_image: data.main_image || "",
            collage_images: data.collage_images || [],
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLayout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    setMainImageFile(file);
    if (file) {
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCollageImageUpload = (e, index) => {
    const file = e.target.files[0];
    const files = [...collageImageFiles];
    const previews = [...collageImagePreviews];

    files[index] = file;
    if (file) {
      previews[index] = URL.createObjectURL(file);
    }

    setCollageImageFiles(files);
    setCollageImagePreviews(previews);
  };

  const uploadImageToStorage = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const deleteImageFromStorage = async (imageUrl) => {
    const fileRef = ref(storage, imageUrl);
    try {
      await deleteObject(fileRef);
    } catch (error) {
      console.log("Error deleting old image:", error);
    }
  };

  const saveChanges = async () => {
    try {
      const docRef = doc(db, "layouts", "home-layout");

      let newMainImageUrl = formData.main_image;
      if (mainImageFile) {
        if (layout.main_image) {
          await deleteImageFromStorage(layout.main_image);
        }
        newMainImageUrl = await uploadImageToStorage(
          mainImageFile,
          `layouts/main-images/${mainImageFile.name}`
        );
      }

      const newCollageImages = [...formData.collage_images];
      for (let i = 0; i < 2; i++) {
        if (collageImageFiles[i]) {
          if (layout.collage_images && layout.collage_images[i]) {
            await deleteImageFromStorage(layout.collage_images[i]);
          }
          newCollageImages[i] = await uploadImageToStorage(
            collageImageFiles[i],
            `layouts/collage-images/${collageImageFiles[i].name}`
          );
        }
      }

      await updateDoc(docRef, {
        title: formData.title,
        description: formData.description,
        main_image: newMainImageUrl,
        collage_images: newCollageImages.slice(0, 2),
      });

      setLayout({
        title: formData.title,
        description: formData.description,
        main_image: newMainImageUrl,
        collage_images: newCollageImages.slice(0, 2),
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Home Layout</h1>
        
      </div>

      <div className="flex flex-1" x-chunk="dashboard-02-chunk-1">
        <div>
        <div className="max-w-[400px] flex justify-center mb-3">
       <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
       </div>
          <div className="max-w-[400px] rounded-lg border border-dashed shadow-sm p-4">

            
            {isEditing ? (
              <>
                <div className="mb-5">
                  <label className="block text-xl font-semibold mb-2">
                    Title:
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-xl font-semibold mb-2">
                    Main Image:
                  </label>
                  <input type="file" onChange={handleMainImageUpload} />
                  {mainImagePreview ? (
                    <img
                      src={mainImagePreview}
                      alt="Main Image Preview"
                      className="w-full rounded-md mt-3"
                    />
                  ) : (
                    layout.main_image && (
                      <img
                        src={layout.main_image}
                        alt="Current Main Image"
                        className="w-full rounded-md mt-3"
                      />
                    )
                  )}
                </div>
                <div className="mb-5">
                  <label className="block text-xl font-semibold mb-2">
                    Description:
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-xl font-semibold mb-2">
                    Collage Images (2 max):
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleCollageImageUpload(e, 0)}
                    className="mb-2"
                  />
                  {collageImagePreviews[0] ? (
                    <img
                      src={collageImagePreviews[0]}
                      alt="Collage Image 1 Preview"
                      className="w-full rounded-md mt-2"
                    />
                  ) : (
                    layout.collage_images[0] && (
                      <img
                        src={layout.collage_images[0]}
                        alt="Current Collage Image 1"
                        className="w-full rounded-md mt-2"
                      />
                    )
                  )}
                  <input
                    type="file"
                    onChange={(e) => handleCollageImageUpload(e, 1)}
                  />
                  {collageImagePreviews[1] ? (
                    <img
                      src={collageImagePreviews[1]}
                      alt="Collage Image 2 Preview"
                      className="w-full rounded-md mt-2"
                    />
                  ) : (
                    layout.collage_images[1] && (
                      <img
                        src={layout.collage_images[1]}
                        alt="Current Collage Image 2"
                        className="w-full rounded-md mt-2"
                      />
                    )
                  )}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={saveChanges}
                    className="bg-green-500 text-white py-2 px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-center">{layout.title}</h2>
                </div>
                <div className="mb-5">
                  <img
                    src={layout.main_image}
                    alt="Main Image"
                    className="w-full rounded-md"
                  />
                </div>
                <div className="mb-5">
                  <p className="text-sm">{layout.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {layout?.collage_images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Collage Image ${index + 1}`}
                      className="w-full rounded-md"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

       
      </div>
    </main>
  );
};

export default HomeLayout;
