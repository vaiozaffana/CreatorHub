import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMain from "@/components/dashboard/DashboardMain";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    redirect("/auth/login");
  }

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <DashboardSidebar user={user} />
      <DashboardMain>{children}</DashboardMain>
    </div>
  );
}
