import { Button } from "@/components/ui/button";
import { Calendar, Clock12, Columns3, Files, List } from "lucide-react";
import { NavLink, Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <>
      <div>
        <div className="bg-amber-300">
          <div>Design Project</div>
          <div>
            <div>
              <Button variant={"outline"} className="">
                Share
              </Button>
              <Button variant={"outline"}>Automation</Button>
            </div>
          </div>
        </div>
        <nav>
          <ul className="flex space-x-6 text-sm border-b border-b-[#e3e3e3]">
            <li>
              <NavLink
                to="/project/overview"
                className="flex space-x-1 items-center"
              >
                <Clock12 size={18} />
                <span>Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/project/list"
                className="flex space-x-1 items-center"
              >
                <List size={18} />
                <span>List</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/project/board"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-indigo-500 flex space-x-1 items-center"
                    : "flex space-x-1 items-center"
                }
              >
                <Columns3 size={18} />
                <span>Board</span>{" "}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/project/calender"
                className="flex space-x-1 items-center"
              >
                <Calendar size={18} />
                <span>Calender</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/project/files"
                className="flex space-x-1 items-center"
              >
                <Files size={18} />
                <span>Files</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  );
};

export default DashboardLayout;
