import { useEffect, useState } from "react";
import API from "../api/api";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
      <p className="text-gray-700">{profile.email}</p>
      <p className="text-gray-500 mt-2">Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
      {/* Add other profile details here */}
    </div>
  );
}
