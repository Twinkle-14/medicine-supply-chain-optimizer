import { useEffect, useMemo, useState } from "react";
import { getAIPredictions } from "../services/api";
import TransferModal from "../components/TransferModal";


export default function AIInsights() {

  const [predictions, setPredictions] = useState([]);

  const [search, setSearch] = useState("");

  const [showTransferModal, setShowTransferModal] = useState(false);

  const [selectedTransfer, setSelectedTransfer] = useState(null);



  useEffect(() => {
    loadPredictions();
  }, []);




  async function loadPredictions(){

    try{

      const data = await getAIPredictions();

      setPredictions(data);


    }catch(err){

      console.error(err);

    }

  }





  const filteredPredictions = useMemo(()=>{


    return predictions.filter((item)=>{


      return (

        item.hospital
        .toLowerCase()
        .includes(search.toLowerCase())


        ||


        item.medicine
        .toLowerCase()
        .includes(search.toLowerCase())


        ||


        item.status
        .toLowerCase()
        .includes(search.toLowerCase())

      );


    });


  },[
    predictions,
    search
  ]);






  function statusBadge(status){

    switch(status){


      case "Critical":
        return "bg-red-100 text-red-700";


      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";


      case "Healthy":
        return "bg-green-100 text-green-700";


      case "Overstock":
        return "bg-orange-100 text-orange-700";


      default:
        return "bg-gray-100 text-gray-700";

    }

  }





  function handleTransfer(item){

    setSelectedTransfer(item);

    setShowTransferModal(true);

  }






  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          AI Insights
        </h1>


        <p className="text-gray-500 mt-1">
          AI-powered inventory recommendations
        </p>


      </div>





      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


        <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">

          <p className="text-gray-500 text-sm">
            Total Predictions
          </p>


          <h2 className="text-4xl font-bold mt-2">
            {predictions.length}
          </h2>


        </div>





        <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">


          <p className="text-gray-500 text-sm">
            Critical
          </p>


          <h2 className="text-4xl font-bold text-red-600 mt-2">

            {
              predictions.filter(
                p=>p.status==="Critical"
              ).length
            }

          </h2>


        </div>





        <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">


          <p className="text-gray-500 text-sm">
            Healthy
          </p>


          <h2 className="text-4xl font-bold text-green-600 mt-2">

            {
              predictions.filter(
                p=>p.status==="Healthy"
              ).length
            }

          </h2>


        </div>





        <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">


          <p className="text-gray-500 text-sm">
            Overstock
          </p>


          <h2 className="text-4xl font-bold text-orange-600 mt-2">

            {
              predictions.filter(
                p=>p.status==="Overstock"
              ).length
            }

          </h2>


        </div>


      </div>





      <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">


        <input

          type="text"

          placeholder="Search hospital, medicine or status..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          className="w-full border rounded-xl p-3"

        />


      </div>

      <div className="bg-white rounded-2xl shadow-sm border">


        <div className="p-6 border-b">

          <h2 className="text-xl font-bold">
            AI Prediction Report
          </h2>

        </div>




        {/* Mobile horizontal scroll */}

        <div className="overflow-x-auto">


          <table className="min-w-[1000px] w-full">


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


                <th className="text-left px-6 py-4">
                  Action
                </th>


              </tr>


            </thead>




            <tbody>


              {
                filteredPredictions.map((item,index)=>(


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

                        className={`px-3 py-1 rounded-full text-sm ${statusBadge(
                          item.status
                        )}`}

                      >

                        {item.status}

                      </span>


                    </td>





                    <td className="px-6 py-4">

                      {item.recommendation}

                    </td>





                    <td className="px-6 py-4">


                      {
                        item.status === "Overstock"

                        ?


                        <button

                          onClick={()=>handleTransfer(item)}

                          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"

                        >

                          Execute Transfer

                        </button>


                        :


                        <span className="text-gray-400">
                          —
                        </span>

                      }


                    </td>




                  </tr>


                ))
              }






              {
                filteredPredictions.length===0 && (

                  <tr>

                    <td

                      colSpan="6"

                      className="text-center py-8 text-gray-500"

                    >

                      No AI predictions found.

                    </td>


                  </tr>


                )
              }



            </tbody>



          </table>


        </div>


      </div>






      <TransferModal

        open={showTransferModal}

        transfer={selectedTransfer}

        onClose={()=>{

          setShowTransferModal(false);

          setSelectedTransfer(null);

        }}

        onSuccess={loadPredictions}

      />



    </div>

  );

}