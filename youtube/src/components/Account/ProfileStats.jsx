import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function ProfileStats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/v1/users/follows/${user._id}`);
        setStats(res.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user._id]);

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
        <div className="flex justify-around">
          {[1, 2].map((item) => (
            <div key={item} className="text-center">
              <div className="h-6 w-12 bg-gray-200 rounded-md mx-auto mb-2"></div>
              <div className="h-4 w-16 bg-gray-100 rounded-md mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex justify-around">
        <div className="text-center group cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <p className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
            {stats.followersCount.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-500 group-hover:text-indigo-500 transition-colors duration-200">
            Followers
          </p>
        </div>
        
        <div className="border-l border-gray-200"></div>
        
        <div className="text-center group cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <p className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
            {stats.followingCount.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-500 group-hover:text-indigo-500 transition-colors duration-200">
            Following
          </p>
        </div>
      </div>
      
      {/* Optional: Add a subtle progress indicator */}
      <div className="mt-4 flex justify-center">
        <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-xs">
          <div 
            className="bg-indigo-600 h-1.5 rounded-full" 
            style={{ 
              width: `${Math.min(100, (stats.followersCount / (stats.followersCount + stats.followingCount + 1)) * 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}