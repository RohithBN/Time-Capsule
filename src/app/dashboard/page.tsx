'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CapsuleModel } from "@/models/CapsuleModel";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

const CapsulesPage = () => {
  const [capsules, setCapsules] = useState<CapsuleModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user as User;

  useEffect(() => {
    const fetchCapsules = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const data={username:user?.username}
        const response = await axios.post("/api/getCapsules",data);
        setCapsules(response.data.capsules);
      } catch (error: any) {
        console.error("Error fetching capsules:", error);
        setError("An error occurred while fetching capsules. Please try again.");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchCapsules();
  }, [isRefreshing]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-950 to-slate-500 p-8">
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">Capsules</h1>

      <button
        className={`px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-md transition-all duration-300 ease-in-out ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:outline-none"
        }`}
        onClick={() => setIsRefreshing(true)}
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh"}
      </button>

      {loading && <p className="text-center mt-4 text-xl text-gray-600">Loading capsules...</p>}

      {/* Display error message */}
      {error && (
        <p className="text-center text-red-500 mt-4 text-xl">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {capsules.map((capsule) => {
          const now = new Date();
          const openOnDate = new Date(capsule.openOn);
          const isOpen = now >= openOnDate;

        
            if (!isOpen) {
                return (
                  <div
                    key={capsule._id.toString()}
                    className="bg-white shadow-2xl rounded-3xl p-8 hover:shadow-3xl transition-all duration-500 ease-in-out opacity-60 pointer-events-none"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <h2 className="text-3xl font-bold text-gray-800 text-center">{capsule.title}</h2>
                      <p className="text-xl text-gray-500 text-center">Capsule is not open yet</p>
                      <p className="text-sm text-gray-400 mt-2 text-center">Opens On: {new Date(capsule.openOn).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="mt-8 text-center bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 p-6 rounded-xl">
                      <p className="text-lg text-gray-600 font-medium">Come back later to unlock!</p>
                    </div>
                  </div>
                );
              }
              

          

          return (
            <div
              key={capsule._id.toString()}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <img
                src={`data:image/jpeg;base64,${capsule.picture}`}
                alt={capsule.title}
                className="w-full h-56 object-cover rounded-lg mb-6"
              />
              <h2 className="text-2xl font-semibold text-gray-800">{capsule.title}</h2>
              <p className="text-gray-700 mt-2">{capsule.description}</p>
              <p className="text-gray-500 text-sm mt-4">Opens On: {new Date(capsule.openOn).toLocaleDateString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CapsulesPage;
