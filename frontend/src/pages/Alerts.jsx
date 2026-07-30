import { useEffect, useState } from "react";
import { getAIPredictions } from "../services/api";

export default function Alerts() {

  const [alerts, setAlerts] = useState([]);


  useEffect(() => {
    loadAlerts();
  }, []);



  async function loadAlerts() {

    try {

      const data = await getAIPredictions();

      const filtered = data.filter(
        (item) =>
          item.status === "Critical" ||
          item.status === "Low Stock"
      );

      setAlerts(filtered);

    } catch (err) {

      console.error(err);

    }

  }



  function badge(status) {

    switch (status) {

      case "Critical":
        return "bg-red-100 text-red-700";

      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";

    }

  }



  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Alerts
        </h1>


        <p className="text-gray-500 mt-1">
          Medicines that require immediate attention
        </p>


      </div>




      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        <div className="bg-white border rounded-2xl shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Critical Alerts
          </p>


          <h2 className="text-4xl font-bold text-red-600 mt-2">

            {
              alerts.filter(
                (a)=>a.status==="Critical"
              ).length
            }

          </h2>


        </div>




        <div className="bg-white border rounded-2xl shadow-sm p-6">


          <p className="text-gray-500 text-sm">
            Low Stock
          </p>


          <h2 className="text-4xl font-bold text-yellow-600 mt-2">

            {
              alerts.filter(
                (a)=>a.status==="Low Stock"
              ).length
            }

          </h2>


        </div>


      </div>





      <div className="bg-white rounded-2xl border shadow-sm">


        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            Active Alerts
          </h2>

        </div>





        {/* Mobile horizontal scrolling table */}

        <div className="w-full overflow-x-auto">


          <table className="min-w-[900px] w-full">


            <thead className="bg-slate-50">


              <tr>

                <th className="text-left px-6 py-4">
                  Hospital
                </th>


                <th className="text-left px-6 py-4">
                  Medicine
                </th>


                <th className="text-left px-6 py-4">
                  Quantity
                </th>


                <th className="text-left px-6 py-4">
                  Status
                </th>


                <th className="text-left px-6 py-4">
                  Recommendation
                </th>


              </tr>


            </thead>




            <tbody>


              {alerts.map((item,index)=>(


                <tr
                  key={index}
                  className="border-t hover:bg-slate-50"
                >


                  <td className="px-6 py-4">
                    {item.hospital}
                  </td>


                  <td className="px-6 py-4 font-medium">
                    {item.medicine}
                  </td>


                  <td className="px-6 py-4">
                    {item.quantity}
                  </td>



                  <td className="px-6 py-4">


                    <span
                      className={`px-3 py-1 rounded-full text-sm ${badge(item.status)}`}
                    >

                      {item.status}

                    </span>


                  </td>



                  <td className="px-6 py-4">
                    {item.recommendation}
                  </td>



                </tr>


              ))}




              {alerts.length === 0 && (

                <tr>

                  <td colSpan="5">

                    <div className="text-center py-10 text-gray-500">

                      No active alerts 🎉

                    </div>

                  </td>

                </tr>

              )}



            </tbody>



          </table>


        </div>



      </div>




    </div>

  );

}