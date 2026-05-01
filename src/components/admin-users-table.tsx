"use client";

import { useMemo } from "react";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { TableSkeleton } from "./dashboard/skeletons";

export function AdminUsersTable() {
  const { data, isLoading } = useGetAllUsersQuery();
  const users = useMemo(() => data?.data?.users || data?.data || [], [data]);

  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-center font-semibold">Courses</th>
              <th className="px-4 py-3 text-left font-semibold">Joined</th>
              <th className="px-4 py-3 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((user: any, idx: number) => (
              <tr
                key={user.id}
                className={`border-b border-border last:border-0 ${idx % 2 === 0 ? "bg-transparent" : "bg-muted/30"}`}
              >
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{user.email}</td>
                <td className="px-4 py-3 text-center">{user.courses}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "active" ? "bg-green-500/20 text-green-700" : "bg-gray-500/20 text-gray-700"
                    }`}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

