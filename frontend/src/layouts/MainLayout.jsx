import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import Dashboard from "../pages/Dashboard";
import Hospitals from "../pages/Hospitals";
import Inventory from "../pages/Inventory";
import Medicines from "../pages/Medicines";
import AIInsights from "../pages/AIInsights";
import Alerts from "../pages/Alerts";
import Transfers from "../pages/Transfers";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import Chatbot from "../components/Chatbot";

export default function MainLayout() {

  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);


  const renderPage = () => {

    switch (page) {

      case "dashboard":
        return <Dashboard />;

      case "hospitals":
        return <Hospitals />;

      case "inventory":
        return <Inventory />;

      case "medicines":
        return <Medicines />;

      case "ai":
        return <AIInsights />;

      case "alerts":
        return <Alerts />;

      case "transfers":
        return <Transfers />;

      case "analytics":
        return <Analytics />;

      case "settings":
        return <Settings />;

      default:
        return <Dashboard />;

    }

  };


  return (

    <div className="flex h-screen bg-[#F5F7FC] overflow-hidden">


      <Sidebar
        page={page}
        setPage={setPage}
        open={open}
        setOpen={setOpen}
      />



      <div className="flex flex-col flex-1 overflow-hidden w-full">


        <Header
          setPage={setPage}
          setOpen={setOpen}
        />



        <main className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-8">

          {renderPage()}

        </main>


      </div>
<Chatbot />

    </div>

  );

}
