import { Bell, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";


export default function Header({ setPage, setOpen }) {

  const { user } = useAuth();


  return (

    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">


      {/* Mobile Menu */}
      <button
        className="md:hidden mr-3"
        onClick={() => setOpen(true)}
      >
        <Menu size={24}/>
      </button>



      {/* Search */}
      <div className="flex-1 min-w-0 md:w-[420px]">

        <input
          type="text"
          placeholder="Search medicines, hospitals, or batches..."
          className="
          w-full
          rounded-full
          bg-[#F5F7FC]
          px-3 md:px-5
          py-2 md:py-3
          outline-none
          text-sm
          "
        />

      </div>



      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-6 ml-3">


        {/* Alert Bell */}
        <button
          onClick={() => setPage("alerts")}
          className="relative"
        >

          <Bell size={22}/>

        </button>



        {/* Divider */}
        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>



        {/* User */}
        <div className="text-right hidden sm:block">

          <p className="font-semibold text-sm whitespace-nowrap">

            {user?.full_name || "User"}

          </p>


          <p className="text-xs text-gray-500 whitespace-nowrap">

            {user?.role || "Hospital Admin"}

          </p>

        </div>


      </div>


    </header>

  );
}