import React, { useState, useRef, useContext, useEffect } from "react";
import { UserContext } from "../context/UserProvider";
import { uploadImageToCloudinary } from "../services/cloudinary";
import Loader from "./Loader";

const EditProfileForm = ({ modalRef }) => {
  const { currentUser, updateUserProfile } = useContext(UserContext);

  const [form, setForm] = useState({
    displayName: "",
    photo: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (currentUser) {
      setForm({ displayName: currentUser.displayName || "", photo: null });
      setImagePreview(currentUser.photoURL);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, photo: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      console.error("No current user.");
      return;
    }

    try {
      setLoading(true);

      let photoURL = currentUser.photoURL;

      if (form.photo) {
        photoURL = await uploadImageToCloudinary(form.photo, "users");
      }

      await updateUserProfile({
        displayName: form.displayName,
        photoURL,
      });

      modalRef.current?.close();
    } catch (err) {
      console.error("Update failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box relative max-w-lg w-full">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50 rounded-2xl">
            <Loader />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-2xl font-bold text-center mb-4">Edit Profile</h3>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Profile Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              className="file-input file-input-bordered w-full"
            />
          </div>

          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-full w-24 h-24 object-cover mx-auto border"
              />
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => modalRef.current?.close()}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditProfileForm;
