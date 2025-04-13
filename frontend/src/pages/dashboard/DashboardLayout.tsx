import { Button } from "@/components/ui/button";
import { Calendar, Clock12, Columns3, Files, List } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { AppSidebar } from "@/components/blocks/app-sidebar";

import { SiteHeader } from "@/components/blocks/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


import { useState } from "react";

const DashboardLayout = () => {
  const [project, setProject] = useState({
    name: "Untitled",
  });
  return (
    <>
      <SidebarProvider>
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader title={project.name} />
          <div className="flex flex-1 flex-col bg-red-200">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-2 md:gap-6 md:py-2">
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

const DashboardNav = () => (
  <nav>
    <ul className="flex space-x-6 text-sm border-b border-b-[#e3e3e3] pb-1.5">
      <li>
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
      </li>
      <li>
        <NavLink
          to="/dashboard/board"
          className={({ isActive }) =>
            isActive
              ? "border-b-2 border-indigo-500 flex space-x-1 items-center"
              : "flex space-x-1 items-center"
          }
        >
          <Columns3 size={18} />
          <span>Board</span>
        </NavLink>
      </li>
    </ul>
  </nav>
);
