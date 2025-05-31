"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Users",
    color: "#2563eb",
  },
  mobile: {
    label: "Admins",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const AdminDashboard: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/user/all");
        const product = await axiosInstance.get("/product");
        const users = res.data.users;
        console.log(product, "product");

        const monthLabel = new Date().toLocaleString("default", {
          month: "long",
        });
        const userCount = users.filter((u: any) => u.role === "user").length;
        const adminCount = users.filter((u: any) => u.role === "admin").length;

        setChartData([
          {
            month: monthLabel,
            desktop: userCount,
            mobile: adminCount,
          },
        ]);
        setTotalUsers(userCount);
        setTotalProducts(product.data.total);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: any) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
