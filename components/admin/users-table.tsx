"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleBan = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isBanned: !currentStatus
      });
    } catch (error) {
      console.error("Error toggling ban status:", error);
      alert("Failed to update user status. Make sure you are logged in as an admin.");
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading users...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3">Telegram ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Joined</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="bg-white border-b">
                <td className="px-6 py-4 font-mono">{user.telegramId}</td>
                <td className="px-6 py-4">
                  {user.firstName} {user.username ? `(@${user.username})` : ''}
                </td>
                <td className="px-6 py-4">
                  {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'Unknown'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.isBanned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant={user.isBanned ? "outline" : "destructive"} 
                    size="sm"
                    onClick={() => toggleBan(user.id, user.isBanned)}
                  >
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
