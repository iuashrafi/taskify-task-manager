import { Columns3 } from "lucide-react";
import { Navigate, NavLink, Outlet } from "react-router";

import { AppSidebar } from "@/components/blocks/app-sidebar";

import { SiteHeader } from "@/components/blocks/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { useAuthContext } from "@/context/AuthContext";

const DashboardLayout = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader title={user.projectName ?? "Untitled"} />
          <div className="flex flex-1 flex-col bg-white">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col">
                <div className="px-4 lg:px-6">
                  <DashboardNav />
                </div>
                <Outlet />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;

export const DashboardNav = () => (
  <nav>
    <ul className="flex space-x-6 text-sm border-b border-b-[#e3e3e3] ">
      <li className="">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex space-x-1 items-center pb-2 -mt-[2px] border-b-2
            ${isActive ? "border-primary text-primary" : "border-transparent"}`
          }
        >
          <Columns3 size={16} />
          <span>Board</span>
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          to="/dashboard/overview"
          className="flex space-x-1 items-center"
        >
          <Clock12 size={18} />
          <span>Overview</span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/list" className="flex space-x-1 items-center">
          <List size={18} />
          <span>List</span>
        </NavLink>
      </li> */}
    </ul>
  </nav>
);
