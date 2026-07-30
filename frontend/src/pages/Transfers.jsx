import { useEffect, useState } from "react";
import {
  getTransfers,
  deleteTransfer,
} from "../services/api";

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    try {
      const data = await getTransfers();
      setTransfers(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transfer?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTransfer(id);

      alert("Transfer deleted successfully");

      loadTransfers();

    } catch (err) {
      alert(err.message);
    }
  }

  function statusBadge(status) {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Medicine Transfers
        </h1>

        <p className="text-gray-500 mt-1">
          Completed medicine transfer history
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">
            Total Transfers
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {transfers.length}
          </h2>
        </div>


        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">
            Completed
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {
              transfers.filter(
                (t) => t.status === "Completed"
              ).length
            }
          </h2>
        </div>


        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <p className="text-gray-500 text-sm">
            Pending
          </p>

          <h2 className="text-4xl font-bold text-yellow-600 mt-2">
            {
              transfers.filter(
                (t) => t.status === "Pending"
              ).length
            }
          </h2>
        </div>

      </div>


      <div className="bg-white rounded-2xl border shadow-sm">


  <div className="p-6 border-b">

    <h2 className="text-xl font-bold">
      Transfer History
    </h2>

  </div>



  <div className="overflow-x-auto">


    <table className="min-w-[1000px] w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left px-6 py-4">
                From Hospital
              </th>

              <th className="text-left px-6 py-4">
                To Hospital
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
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {transfers.map((item) => (

              <tr
                key={item.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-4">
                  {item.from_hospital}
                </td>


                <td className="px-6 py-4">
                  {item.to_hospital}
                </td>


                <td className="px-6 py-4 font-medium">
                  {item.medicine}
                </td>


                <td className="px-6 py-4">
                  {item.quantity}
                </td>


                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                </td>


                <td className="px-6 py-4">

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    Delete
                  </button>

                </td>


              </tr>

            ))}


            {transfers.length === 0 && (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-8 text-gray-500"
                >
                  No transfers found.
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