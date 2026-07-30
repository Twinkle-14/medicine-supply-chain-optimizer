import { useEffect, useMemo, useState } from "react";

import {
  getInventory,
  getHospitals,
  getMedicines,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../services/api";


export default function Inventory() {

  const [inventory, setInventory] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);


  const [search, setSearch] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [medicineFilter, setMedicineFilter] = useState("");


  const [form, setForm] = useState({
    hospital_id: "",
    medicine_id: "",
    quantity: "",
  });



  useEffect(() => {
    loadData();
  }, []);



  async function loadData(){

    try{

      const [
        inventoryData,
        hospitalData,
        medicineData
      ] = await Promise.all([
        getInventory(),
        getHospitals(),
        getMedicines()
      ]);


      setInventory(inventoryData);
      setHospitals(hospitalData);
      setMedicines(medicineData);


    }catch(err){

      console.error(err);

    }

  }




  function getStatus(quantity){

    if(quantity < 100){

      return {
        text:"Critical",
        className:"bg-red-100 text-red-700"
      };

    }


    if(quantity < 500){

      return {
        text:"Low Stock",
        className:"bg-yellow-100 text-yellow-700"
      };

    }


    if(quantity <= 1500){

      return {
        text:"Healthy",
        className:"bg-green-100 text-green-700"
      };

    }


    return {
      text:"Overstock",
      className:"bg-orange-100 text-orange-700"
    };

  }




  const filteredInventory = useMemo(()=>{


    return inventory.filter((item)=>{


      const searchMatch =
        item.hospital
        ?.toLowerCase()
        .includes(search.toLowerCase())

        ||

        item.medicine
        ?.toLowerCase()
        .includes(search.toLowerCase());



      const hospitalMatch =
        hospitalFilter === "" ||

        item.hospital_id === Number(hospitalFilter);



      const medicineMatch =
        medicineFilter === "" ||

        item.medicine_id === Number(medicineFilter);



      return (
        searchMatch &&
        hospitalMatch &&
        medicineMatch
      );


    });


  },[
    inventory,
    search,
    hospitalFilter,
    medicineFilter
  ]);





  async function handleDelete(id){

    const confirmDelete =
      window.confirm(
        "Delete this inventory record?"
      );


    if(!confirmDelete) return;


    try{

      await deleteInventory(id);

      loadData();


    }catch(err){

      console.error(err);

    }

  }





  function handleEdit(item){

    setEditingInventory(item);

    setIsEditing(true);


    setForm({

      hospital_id:item.hospital_id,

      medicine_id:item.medicine_id,

      quantity:item.quantity

    });


    setShowModal(true);

  }





  async function handleSubmit(e){

    e.preventDefault();


    try{


      if(isEditing){

        await updateInventory(
          editingInventory.id,
          form
        );


      }else{


        await createInventory(form);


      }


      setShowModal(false);

      setIsEditing(false);

      setEditingInventory(null);


      setForm({

        hospital_id:"",
        medicine_id:"",
        quantity:""

      });


      loadData();



    }catch(err){

      console.error(err);

    }


  }




  return (

    <div className="space-y-8">


      <div className="flex flex-col md:flex-row justify-between gap-4">


        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Inventory
          </h1>


          <p className="text-gray-500 mt-1">
            Manage medicine stock across hospitals
          </p>


        </div>



        <button

          onClick={()=>setShowModal(true)}

          className="bg-blue-700 text-white px-5 py-3 rounded-xl"
        >

          + Add Inventory

        </button>


      </div>





      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">


        <div className="bg-white border rounded-2xl p-6">

          <p>Total Records</p>

          <h2 className="text-4xl font-bold">
            {inventory.length}
          </h2>

        </div>


        <div className="bg-white border rounded-2xl p-6">

          <p>Critical Stock</p>

          <h2 className="text-4xl font-bold text-red-600">
            {
              inventory.filter(
                i=>i.quantity<100
              ).length
            }
          </h2>

        </div>


        <div className="bg-white border rounded-2xl p-6">

          <p>Healthy Stock</p>

          <h2 className="text-4xl font-bold text-green-600">
            {
              inventory.filter(
                i=>i.quantity>=500 && i.quantity<=1500
              ).length
            }
          </h2>

        </div>


        <div className="bg-white border rounded-2xl p-6">

          <p>Overstock</p>

          <h2 className="text-4xl font-bold text-orange-600">
            {
              inventory.filter(
                i=>i.quantity>1500
              ).length
            }
          </h2>

        </div>


      </div>
      <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          <input
            type="text"
            placeholder="Search hospital or medicine..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border rounded-xl p-3"
          />



          <select
            value={hospitalFilter}
            onChange={(e)=>setHospitalFilter(e.target.value)}
            className="border rounded-xl p-3"
          >

            <option value="">
              All Hospitals
            </option>


            {
              hospitals.map((h)=>(
                <option
                  key={h.id}
                  value={h.id}
                >
                  {h.name}
                </option>
              ))
            }

          </select>




          <select
            value={medicineFilter}
            onChange={(e)=>setMedicineFilter(e.target.value)}
            className="border rounded-xl p-3"
          >

            <option value="">
              All Medicines
            </option>


            {
              medicines.map((m)=>(
                <option
                  key={m.id}
                  value={m.id}
                >
                  {m.name}
                </option>
              ))
            }

          </select>


        </div>


      </div>





      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">


        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            Inventory Records
          </h2>

        </div>




        <div className="overflow-x-auto">


          <table className="min-w-[900px] w-full">


            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left">
                  Hospital
                </th>

                <th className="px-6 py-4 text-left">
                  Medicine
                </th>

                <th className="px-6 py-4 text-left">
                  Quantity
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>




            <tbody>


              {
                filteredInventory.map((item)=>{


                  const status =
                    getStatus(item.quantity);



                  return (

                    <tr
                      key={item.id}
                      className="border-t"
                    >

                      <td className="px-6 py-4">
                        {item.hospital}
                      </td>


                      <td className="px-6 py-4">
                        {item.medicine}
                      </td>


                      <td className="px-6 py-4 font-semibold">
                        {item.quantity}
                      </td>


                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${status.className}`}
                        >
                          {status.text}
                        </span>

                      </td>


                      <td className="px-6 py-4 text-center">


                        <button
                          onClick={()=>handleEdit(item)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg mr-2"
                        >
                          Edit
                        </button>


                        <button
                          onClick={()=>handleDelete(item.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg"
                        >
                          Delete
                        </button>


                      </td>


                    </tr>

                  );


                })
              }





              {
                filteredInventory.length===0 && (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-8 text-gray-500"
                    >
                      No inventory records found.
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


            <div className="bg-white rounded-2xl p-6 w-full max-w-md">


              <h2 className="text-2xl font-bold mb-6">

                {
                  isEditing
                  ? "Edit Inventory"
                  : "Add Inventory"
                }

              </h2>




              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >



                <select

                  value={form.hospital_id}

                  onChange={(e)=>
                    setForm({
                      ...form,
                      hospital_id:e.target.value
                    })
                  }

                  className="w-full border rounded-xl p-3"

                  required

                >

                  <option value="">
                    Select Hospital
                  </option>


                  {
                    hospitals.map((h)=>(

                      <option
                        key={h.id}
                        value={h.id}
                      >
                        {h.name}
                      </option>

                    ))
                  }


                </select>





                <select

                  value={form.medicine_id}

                  onChange={(e)=>
                    setForm({
                      ...form,
                      medicine_id:e.target.value
                    })
                  }

                  className="w-full border rounded-xl p-3"

                  required

                >

                  <option value="">
                    Select Medicine
                  </option>


                  {
                    medicines.map((m)=>(

                      <option
                        key={m.id}
                        value={m.id}
                      >
                        {m.name}
                      </option>

                    ))
                  }


                </select>





                <input

                  type="number"

                  placeholder="Quantity"

                  value={form.quantity}

                  onChange={(e)=>
                    setForm({
                      ...form,
                      quantity:e.target.value
                    })
                  }

                  className="w-full border rounded-xl p-3"

                  required

                />





                <div className="flex justify-end gap-3">


                  <button

                    type="button"

                    onClick={()=>setShowModal(false)}

                    className="px-4 py-2 border rounded-xl"

                  >

                    Cancel

                  </button>



                  <button

                    type="submit"

                    className="bg-blue-700 text-white px-5 py-2 rounded-xl"

                  >

                    Save

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