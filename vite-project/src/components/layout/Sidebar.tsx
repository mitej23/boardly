import { LayoutDashboard, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";

const Sidebar = () => {
  const links = [
    {
      id: 1,
      name: "Dasboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} className="mr-2" />,
    },
    {
      id: 2,
      name: "Settings",
      path: "/settings",
      icon: <Settings size={20} className="mr-2" />,
    },
  ];

  return (
    <div className="flex flex-col bg-gray-50 h-screen w-[220px] border-r fixed">
      <h1 className="text-3xl font-semibold text-center mt-8">Board.ly</h1>
      <div className="flex flex-col mt-8 gap-1 flex-1 mb-4">
        {links.map(({ id, name, path, icon }) => {
          return (
            <NavLink
              key={id}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "font-bold bg-gray-200 text-gray-800"
                    : "hover:bg-gray-100 "
                } mx-4 text-center py-2 px-4 text-md rounded-md flex flex-row items-center`
              }
              to={path}>
              {icon}
              {name}
            </NavLink>
          );
        })}
        <div className="mt-auto mx-4">
          <Button
            className="w-full bg-red-50 border-red-200 text-red-400 hover:bg-red-200 hover:text-red-500"
            variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
