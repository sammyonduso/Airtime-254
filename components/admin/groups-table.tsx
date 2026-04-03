"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";

export function GroupsTable() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "groups"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groupData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(groupData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching groups:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading groups...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3">Group Name</th>
            <th className="px-6 py-3">Admin ID</th>
            <th className="px-6 py-3">Total Earned</th>
            <th className="px-6 py-3">Unpaid Balance</th>
            <th className="px-6 py-3">Added On</th>
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No groups found</td>
            </tr>
          ) : (
            groups.map((group) => (
              <tr key={group.id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium">{group.groupName}</td>
                <td className="px-6 py-4 font-mono text-xs">{group.adminTelegramId}</td>
                <td className="px-6 py-4 text-green-600 font-medium">KES {group.totalEarned.toFixed(2)}</td>
                <td className="px-6 py-4 font-medium">KES {group.commissionBalance.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {group.createdAt ? format(new Date(group.createdAt), 'MMM d, yyyy') : 'Unknown'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
