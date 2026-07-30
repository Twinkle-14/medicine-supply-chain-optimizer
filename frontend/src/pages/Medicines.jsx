import { useEffect, useMemo, useState } from "react";
import {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../services/api";


export default function Medicines() {

  const [medicines, setMedicines] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [editingMedicine, setEditingMedicine] = useState(null);

  const [isEditing, setIsEditing] = useState(false);


  const [search, setSearch] = useState("");


  const [form, setForm] = useState({
    name:"",
    category:"",
  });



  useEffect(()=>{
    loadMedicines();
  },[]);



  async function loadMedicines(){

    try{

      const data = await getMedicines();

      setMedicines(data);

    }catch(err){

      console.error(err);

    }

  }




  const filteredMedicines = useMemo(()=>{

    return medicines.filter((medicine)=>{

      return (

        medicine.name
        .toLowerCase()
        .includes(search.toLowerCase())

        ||

        (medicine.category || "")
        .toLowerCase()
        .includes(search.toLowerCase())

      );

    });


  },[
    medicines,
    search
  ]);





  async function handleSubmit(e){

    e.preventDefault();


    try{


      if(isEditing){

        await updateMedicine(
          editingMedicine.id,
          form
        );


      }else{


        await createMedicine(form);


      }


      setForm({
        name:"",
        category:"",
      });


      setShowModal(false);

      setEditingMedicine(null);

      setIsEditing(false);


      loadMedicines();



    }catch(err){

      console.error(err);

      alert("Failed to save medicine.");

    }


  }





  async function handleDelete(id){

    if(!window.confirm("Delete this medicine?"))
      return;


    try{

      const result = await deleteMedicine(id);

      alert(result.message);

      loadMedicines();


    }catch(err){

      alert(err.message);

    }

  }





  function handleEdit(medicine){

    setEditingMedicine(medicine);

    setIsEditing(true);


    setForm({

      name:medicine.name,

      category:medicine.category || ""

    });


    setShowModal(true);

  }





  function getBadge(category){

    switch(
      (category || "").toLowerCase()
    ){

      case "tablet":
        return "bg-blue-100 text-blue-700";

      case "capsule":
        return "bg-purple-100 text-purple-700";

      case "injection":
        return "bg-red-100 text-red-700";

      case "syrup":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  }





  return (

    <div className="space-y-8">


      <div className="flex flex-col md:flex-row justify-between gap-4">


        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Medicines
          </h1>


          <p className="text-gray-500 mt-1">
            Manage medicine catalogue
          </p>

        </div>



        <button

          onClick={()=>{

            setForm({
              name:"",
              category:"",
            });

            setEditingMedicine(null);

            setIsEditing(false);

            setShowModal(true);

          }}

          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold"

        >

          + Add Medicine

        </button>


      </div>





      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">

          <p className="text-gray-500 text-sm">
            Total Medicines
          </p>


          <h2 className="text-4xl font-bold mt-2">
            {medicines.length}
          </h2>


        </div>



        <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">


          <p className="text-gray-500 text-sm">
            Categories
          </p>


          <h2 className="text-4xl font-bold text-blue-600 mt-2">

            {
              new Set(
                medicines.map(m=>m.category)
              ).size
            }

          </h2>


        </div>



        <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">


          <p className="text-gray-500 text-sm">
            Active Records
          </p>


          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {medicines.length}
          </h2>


        </div>


      </div>





      <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">


        <input

          type="text"

          placeholder="Search medicine..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          className="w-full border rounded-xl p-3"

        />


      </div>
      <div className="bg-white rounded-2xl border shadow-sm">


        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            Medicine Directory
          </h2>

        </div>




        {/* Mobile horizontal scroll */}

        <div className="overflow-x-auto">


          <table className="min-w-[700px] w-full">


            <thead className="bg-slate-50">


              <tr className="text-left">


                <th className="px-6 py-4">
                  Medicine
                </th>


                <th className="px-6 py-4">
                  Category
                </th>


                <th className="px-6 py-4 text-center">
                  Actions
                </th>


              </tr>


            </thead>





            <tbody>


              {
                filteredMedicines.map((medicine)=>(


                  <tr

                    key={medicine.id}

                    className="border-t hover:bg-slate-50"

                  >



                    <td className="px-6 py-4 font-medium">

                      {medicine.name}

                    </td>





                    <td className="px-6 py-4">


                      <span

                        className={`px-3 py-1 rounded-full text-sm ${getBadge(
                          medicine.category
                        )}`}

                      >

                        {medicine.category || "General"}

                      </span>


                    </td>





                    <td className="px-6 py-4 text-center">


                      <button

                        onClick={()=>handleEdit(medicine)}

                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg mr-2 hover:bg-blue-200"

                      >

                        Edit

                      </button>





                      <button

                        onClick={()=>handleDelete(medicine.id)}

                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200"

                      >

                        Delete

                      </button>


                    </td>




                  </tr>


                ))
              }





              {
                filteredMedicines.length===0 && (

                  <tr>

                    <td

                      colSpan="3"

                      className="text-center py-8 text-gray-500"

                    >

                      No medicines found.

                    </td>


                  </tr>


                )
              }



            </tbody>



          </table>


        </div>


      </div>







      {
        showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">


            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">



              <h2 className="text-2xl font-bold mb-6">

                {
                  isEditing
                  ? "Edit Medicine"
                  : "Add Medicine"
                }

              </h2>





              <form

                onSubmit={handleSubmit}

                className="space-y-4"

              >



                <div>


                  <label className="block mb-2 font-medium">

                    Medicine Name

                  </label>



                  <input

                    type="text"

                    value={form.name}

                    onChange={(e)=>

                      setForm({

                        ...form,

                        name:e.target.value

                      })

                    }


                    className="w-full border rounded-xl p-3"

                    required

                  />


                </div>






                <div>


                  <label className="block mb-2 font-medium">

                    Category

                  </label>



                  <select

                    value={form.category}

                    onChange={(e)=>

                      setForm({

                        ...form,

                        category:e.target.value

                      })

                    }


                    className="w-full border rounded-xl p-3"

                    required

                  >


                    <option value="">
                      Select Category
                    </option>


                    <option value="Tablet">
                      Tablet
                    </option>


                    <option value="Capsule">
                      Capsule
                    </option>


                    <option value="Injection">
                      Injection
                    </option>


                    <option value="Syrup">
                      Syrup
                    </option>


                    <option value="Ointment">
                      Ointment
                    </option>


                    <option value="Drops">
                      Drops
                    </option>


                    <option value="Other">
                      Other
                    </option>



                  </select>



                </div>





                <div className="flex justify-end gap-3 pt-4">


                  <button

                    type="button"

                    onClick={()=>{

                      setShowModal(false);

                      setIsEditing(false);

                      setEditingMedicine(null);


                    }}

                    className="px-5 py-2 rounded-xl border"

                  >

                    Cancel

                  </button>





                  <button

                    type="submit"

                    className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl"

                  >

                    {
                      isEditing
                      ? "Update"
                      : "Save"
                    }


                  </button>



                </div>




              </form>



            </div>


          </div>


        )
      }


    </div>

  );

}