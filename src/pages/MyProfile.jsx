import { useContext, useRef } from "react";
import { UserContext } from "../context/UserProvider";
import EditProfileForm from "../components/EditProfileForm";
import Layout from "../components/Layout";

export const MyProfile = () => {
  const { currentUser, signout } = useContext(UserContext);
  const modalRef = useRef();

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={
              currentUser?.photoURL ||
              "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
            }
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <h2 className="text-2xl font-semibold">
            {currentUser?.displayName || "Username"}
          </h2>
          <p className="text-gray-600">{currentUser?.email}</p>

          <div className="mt-6 w-full space-y-2">
            <button
              onClick={() => modalRef.current?.showModal()}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              Edit Profile
            </button>
            <button
              onClick={signout}
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <EditProfileForm modalRef={modalRef} />
    </Layout>
  );
};
