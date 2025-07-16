import React, { useContext, useRef, useState } from "react";
import { uploadImageToCloudinary } from "../services/cloudinary";
import Loader from "./Loader";
import { PostContext } from "../context/PostProvider";
import { UserContext } from "../context/UserProvider";

export const PostForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageFile: null,
    imageURL: "",
  });

  const [imageInputType, setImageInputType] = useState("upload");
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { createPost } = useContext(PostContext);
  const { currentUser } = useContext(UserContext);

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      imageFile: null,
      imageURL: "",
    });
    setImageInputType("upload");
    setErrors({});
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    modalRef.current?.close();
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setForm((prev) => ({ ...prev, imageFile: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      if (name === "imageURL") setImagePreview(value);
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.description.trim() || form.description.length < 10)
      newErrors.description = "Description must be at least 10 characters.";
    if (imageInputType === "upload") {
      if (!form.imageFile) newErrors.imageFile = "Please upload an image file.";
      else if (
        !["image/jpeg", "image/png", "image/webp"].includes(form.imageFile.type)
      ) {
        newErrors.imageFile = "Only JPG, PNG, or WEBP images are allowed.";
      }
    } else {
      if (!form.imageURL.trim() || !form.imageURL.startsWith("http"))
        newErrors.imageURL = "Please provide a valid image URL.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      let imagePath =
        imageInputType === "upload"
          ? await uploadImageToCloudinary(form.imageFile)
          : form.imageURL;

      const postData = {
        title: form.title,
        description: form.description,
        imageURL: imagePath,
        createdAt: new Date(),
        updatedAt: new Date(),
        uid: currentUser?.uid,
        username: currentUser?.displayName || "Anonymous",
        photoURL: currentUser?.photoURL || "",
        likes: [],
        shares: [],
        comments: [],
      };

      await createPost(postData);
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          resetForm();
          modalRef.current?.showModal();
        }}
        className="btn bg-blue-500 hover:bg-blue-700 rounded-full w-14 h-14 text-2xl text-white fixed bottom-2 right-2 z-50 shadow-lg flex items-center justify-center">
        +
      </button>

      <dialog id="my_modal_3" className="modal" ref={modalRef}>
        <div className="modal-box max-w-2xl w-full relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50 rounded-2xl">
              <Loader />
            </div>
          )}
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
            ✕
          </button>
          <h3 className="text-2xl font-bold text-center mb-6">New Post</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="textarea textarea-bordered w-full"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Image Input Type
              </label>
              <select
                value={imageInputType}
                onChange={(e) => {
                  setImageInputType(e.target.value);
                  setImagePreview(null);
                }}
                className="select select-bordered w-full">
                <option value="upload">Upload Image</option>
                <option value="url">Image URL</option>
              </select>
            </div>

            {imageInputType === "upload" ? (
              <div>
                <label
                  htmlFor="imageFile"
                  className="block text-sm font-medium mb-1">
                  Upload Image
                </label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  ref={fileInputRef}
                  onChange={handleChange}
                />
                {errors.imageFile && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.imageFile}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="imageURL"
                  className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  id="imageURL"
                  name="imageURL"
                  value={form.imageURL}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full"
                />
                {errors.imageURL && (
                  <p className="text-sm text-red-500 mt-1">{errors.imageURL}</p>
                )}
              </div>
            )}

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-md w-full max-h-64 object-cover border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-700 text-white"
                disabled={loading}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};
