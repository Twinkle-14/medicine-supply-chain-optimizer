import {
  LayoutDashboard,
  Hospital,
  Boxes,
  Pill,
  BrainCircuit,
  Bell,
  ArrowRightLeft,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "hospitals", label: "Hospitals", icon: Hospital },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "medicines", label: "Medicines", icon: Pill },
  { id: "ai", label: "AI Insights", icon: BrainCircuit },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "transfers", label: "Transfers", icon: ArrowRightLeft },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];


export default function Sidebar({
  page,
  setPage,
  open,
  setOpen,
}) {

  const { logout } = useAuth();
  const navigate = useNavigate();


  function handleLogout() {
    logout();
    navigate("/login");
  }


  function handleClick(id) {
    setPage(id);
    setOpen(false);
  }


  return (

    <aside

      className={`
      fixed md:static
      top-0 left-0
      z-50

      w-64
      h-screen

      bg-[#F4F7FF]
      border-r border-gray-200

      flex flex-col

      overflow-y-auto

      transition-transform duration-300

      ${
        open
        ? "translate-x-0"
        : "-translate-x-full md:translate-x-0"
      }

      `}

    >


      {/* Logo */}

      <div>


        <div className="flex items-center justify-between px-6 py-6">


          <div className="flex items-center gap-3">


            <div className="h-10 w-10 rounded-xl bg-[#1248B5] flex items-center justify-center text-white font-bold text-xl">

              ∞

            </div>


            <div>

              <h1 className="text-[30px] font-bold leading-none text-[#123B8F]">

                MediSync AI

              </h1>


              <p className="text-sm text-gray-500">

                Logistics Command

              </p>


            </div>


          </div>



          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >

            <X size={22}/>

          </button>


        </div>




        <nav className="mt-6 space-y-2 px-3">


          {
            menu.map((item)=>{

              const Icon = item.icon;


              return (

                <button

                  key={item.id}

                  onClick={() => handleClick(item.id)}

                  className={`
                  w-full flex items-center gap-3
                  px-4 py-3 rounded-xl

                  ${
                    page === item.id
                    ? "bg-[#DCE8FF] text-[#1248B5] font-semibold"
                    : "hover:bg-white text-gray-700"
                  }

                  `}

                >

                  <Icon size={20}/>

                  {item.label}


                </button>

              );


            })
          }


        </nav>


      </div>





      {/* Bottom */}

      <div className="mt-auto p-4 border-t">


       



        <button

          onClick={handleLogout}

          className="mt-3 flex items-center gap-3 text-red-600 hover:text-red-700"

        >

          <LogOut size={18}/>

          Logout


        </button>


      </div>


    </aside>

  );
}