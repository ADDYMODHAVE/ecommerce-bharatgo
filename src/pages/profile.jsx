import { useState, useEffect } from "react";
import { userAPI } from "../services/api";
import { setLoading, clearLoading } from "../store/loadingSlice";
import { useDispatch } from "react-redux";
import Loader from "../components/Loader";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    role: "",
  });
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        dispatch(setLoading({ isLoading: true, message: "Loading profile..." }));
        const response = await userAPI.getProfile();
        setProfile({
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.avatar,
          role: response.data.role,
        });
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile:", err);
      } finally {
        dispatch(clearLoading());
      }
    };

    fetchProfile();
  }, [dispatch]);

  if (isLoading && !profile.name) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h1>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={profile.avatar}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Role: {profile.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                  <p className="text-gray-900">{profile.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
