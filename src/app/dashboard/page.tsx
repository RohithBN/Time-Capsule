'use client'
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {session ? (
        <p>Welcome, {session.user.username}</p>
      ) : (
        <p>Please sign in to access the dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
