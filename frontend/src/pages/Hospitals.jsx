import { useEffect, useState } from "react";
import { getAIPredictions } from "../services/api";
import {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} from "../services/api";

export default function Hospitals() {

  const [hospitals, setHospitals] = useState([]);
  const [aiScore, setAiScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
  });


  useEffect(() => {
    loadHospitals();
  }, []);



async function loadHospitals() {

  try {

    const data = await getHospitals();

    setHospitals(data);


    const predictions = await getAIPredictions();


    const critical = predictions.filter(
      p => p.status === "Critical"
    ).length;


    const low = predictions.filter(
      p => p.status === "Low Stock"
    ).length;


    const overstock = predictions.filter(
      p => p.status === "Overstock"
    ).length;



    let score =
      100 -
      (critical * 5) -
      (low * 2) -
      (overstock * 1);



    if(score < 0)
      score = 0;



    setAiScore(score);


  } catch(err){

    console.error(err);

  }

}



  async function handleSubmit(e) {

    e.preventDefault();

    try {

      if (isEditing) {
        await updateHospital(editingHospital.id, form);
      } 
      else {
        await createHospital(form);
      }


      setForm({
        name: "",
        location: "",
      });


      setShowModal(false);
      setIsEditing(false);
      setEditingHospital(null);


      loadHospitals();


    } catch(err) {

      console.error(err);

    }

  }



  async function handleDelete(id) {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hospital?"
    );


    if(!confirmDelete) return;


    try {

      const result = await deleteHospital(id);

      alert(result.message);

      loadHospitals();


    } catch(err) {

      alert(err.message);

    }

  }



  function handleEdit(hospital) {

    setEditingHospital(hospital);

    setIsEditing(true);


    setForm({
      name:hospital.name,
      location:hospital.location,
    });


    setShowModal(true);

  }



  return (

    <div className="space-y-8">


      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Hospitals
          </h1>


          <p className="text-gray-500 mt-1">
            Connected healthcare facilities
          </p>


        </div>



        <button
          onClick={()=>setShowModal(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold"
        >
          + Add Hospital
        </button>


      </div>




      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">


        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <p className="text-gray-500 text-sm">
            Total Hospitals
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {hospitals.length}
          </h2>
        </div>



        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <p className="text-gray-500 text-sm">
            Active
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {hospitals.length}
          </h2>

        </div>




        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <p className="text-gray-500 text-sm">
            Regions
          </p>


          <h2 className="text-4xl font-bold text-blue-700 mt-2">

            {
              new Set(
                hospitals.map((h)=>h.location)
              ).size
            }

          </h2>

        </div>




        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <p className="text-gray-500 text-sm">
            AI Score
          </p>

          <h2 className="text-4xl font-bold text-purple-700 mt-2">
           {aiScore}%
          </h2>

        </div>


      </div>





      <div className="bg-white rounded-2xl border shadow-sm">


        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            Hospital Directory
          </h2>

        </div>




        {/* Mobile horizontal scroll */}

        <div className="w-full overflow-x-auto">


          <table className="min-w-[900px] w-full">


            <thead className="bg-slate-50">

              <tr className="text-left">

                <th className="px-6 py-4">
                  Hospital
                </th>


                <th className="px-6 py-4">
                  Location
                </th>


                <th className="px-6 py-4">
                  Status
                </th>


                <th className="px-6 py-4 text-center">
                  Actions
                </th>


              </tr>

            </thead>



            <tbody>


              {hospitals.map((hospital)=>(


                <tr
                  key={hospital.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-medium">
                    {hospital.name}
                  </td>


                  <td className="px-6 py-4">
                    {hospital.location}
                  </td>


                  <td className="px-6 py-4">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>

                  </td>


                  <td className="px-6 py-4 text-center">


                    <button
                      onClick={()=>handleEdit(hospital)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg mr-2 hover:bg-blue-200"
                    >
                      Edit
                    </button>


                    <button
                      onClick={()=>handleDelete(hospital.id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200"
                    >
                      Delete
                    </button>


                  </td>


                </tr>


              ))}



              {hospitals.length===0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center py-8 text-gray-500"
                  >
                    No hospitals found.
                  </td>

                </tr>

              )}



            </tbody>


          </table>


        </div>


      </div>




      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">


            <h2 className="text-2xl font-bold mb-6">
              {isEditing ? "Edit Hospital" : "Add Hospital"}
            </h2>



            <form onSubmit={handleSubmit} className="space-y-4">


              <input
                type="text"
                placeholder="Hospital Name"
                value={form.name}
                onChange={(e)=>setForm({...form,name:e.target.value})}
                className="w-full border rounded-xl p-3"
                required
              />



              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e)=>setForm({...form,location:e.target.value})}
                className="w-full border rounded-xl p-3"
                required
              />



              <div className="flex justify-end gap-3 pt-4">


                <button
                  type="button"
                  onClick={()=>setShowModal(false)}
                  className="px-5 py-2 rounded-xl border"
                >
                  Cancel
                </button>



                <button
                  type="submit"
                  className="bg-blue-700 text-white px-5 py-2 rounded-xl"
                >
                  {isEditing ? "Update" : "Save"}
                </button>


              </div>


            </form>


          </div>


        </div>

      )}


    </div>

  );

}