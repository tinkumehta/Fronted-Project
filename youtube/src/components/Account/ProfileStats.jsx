// ProfileStats.jsx
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function ProfileStats() {
  const [stats, setStats] = useState(null);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    axios.get(`/api/v1/users/follows/${user._id}`).then((res) => {
      setStats(res.data.data);
    });
  }, []);

  if (!stats) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      <div className="flex justify-around">
        <div>
          <p className="font-bold">{stats.followersCount}</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div>
          <p className="font-bold">{stats.followingCount}</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
      </div>
    </div>
  );
}
