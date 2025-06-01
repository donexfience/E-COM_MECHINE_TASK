import { logoutUser } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const AdminHeader = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.auth);
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <div>
      <div className="bg-slate-900 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4 text-white">
              <span className="text-sm ">
                Welcome, {user.name}
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                ADMIN
              </span>

              {user ? (
                <>
                  <span className="text-sm ">
                    Hello, {user.username}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
