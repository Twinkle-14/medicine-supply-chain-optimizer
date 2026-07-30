import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(false);

  const [preferences, setPreferences] = useState({
    critical: true,
    lowStock: true,
    transfer: true,
  });


  function handleSave() {
    localStorage.setItem(
      "preferences",
      JSON.stringify({
        darkMode,
        preferences,
      })
    );

    alert("Preferences saved successfully!");
  }


  return (
    <div className="space-y-5">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="text-gray-500">
          Manage your account and system preferences
        </p>
      </div>



      {/* Profile */}

      <div className="bg-white border rounded-2xl p-5">

        <h2 className="text-xl font-bold mb-4">
          Profile Information
        </h2>


        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <p className="text-sm text-gray-500">
              Full Name
            </p>
            <p className="font-semibold">
              {user?.full_name}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>
            <p className="font-semibold">
              {user?.email}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Role
            </p>
            <p className="font-semibold">
              {user?.role}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Hospital ID
            </p>
            <p className="font-semibold">
              {user?.hospital_id || "-"}
            </p>
          </div>

        </div>

      </div>




      {/* Notifications */}

      <div className="bg-white border rounded-2xl p-5">

        <h2 className="text-xl font-bold mb-4">
          Notification Preferences
        </h2>


        {[
          ["critical","Critical Stock Alerts"],
          ["lowStock","Low Stock Alerts"],
          ["transfer","Transfer Updates"],
        ].map(([key,label]) => (

          <div
            key={key}
            className="flex justify-between py-2"
          >

            <span>
              {label}
            </span>


            <input
              type="checkbox"
              checked={preferences[key]}
              onChange={(e)=>
                setPreferences({
                  ...preferences,
                  [key]: e.target.checked
                })
              }
            />

          </div>

        ))}

      </div>





      {/* System */}

      <div className="bg-white border rounded-2xl p-5">

        <h2 className="text-xl font-bold mb-4">
          System Preferences
        </h2>
        <button
          onClick={handleSave}
          className="mt-5 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold"
        >
          Save Preferences
        </button>


      </div>


    </div>
  );
}