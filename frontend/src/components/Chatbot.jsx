import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function Chatbot() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hello 👋 I am MediSync AI Assistant. How can I help you?"
    }
  ]);


  function getReply(text) {

    const msg = text.toLowerCase();


    if (
      msg.includes("hello") ||
      msg.includes("hi") ||
      msg.includes("hey")
    ) {
      return "Hello 😊 Welcome to MediSync AI. I can help you with inventory, hospitals, medicines, alerts and transfers.";
    }


    if (
      msg.includes("inventory") ||
      msg.includes("stock")
    ) {
      return "Inventory module manages medicine quantity across hospitals. You can check stock levels, update quantities and monitor availability.";
    }


    if (
      msg.includes("low") ||
      msg.includes("critical")
    ) {
      return "Critical and Low Stock medicines are detected by AI Insights and shown in the Alerts section for quick action.";
    }


    if (msg.includes("hospital")) {
      return "Hospitals section provides connected healthcare facilities, locations, active status and management options.";
    }


    if (
      msg.includes("medicine") ||
      msg.includes("drug")
    ) {
      return "Medicines can be added, updated and managed from the Medicines module.";
    }


    if (
      msg.includes("transfer") ||
      msg.includes("move")
    ) {
      return "AI recommends medicine transfers when one hospital has excess stock and another hospital requires supply.";
    }


    if (
      msg.includes("ai") ||
      msg.includes("prediction")
    ) {
      return "AI Insights analyzes inventory data and identifies Critical, Low Stock, Healthy and Overstock conditions.";
    }


    if (
      msg.includes("score") ||
      msg.includes("health")
    ) {
      return "AI Score represents the overall supply chain health based on inventory balance and medicine availability.";
    }


    if (
      msg.includes("help") ||
      msg.includes("what can you do")
    ) {
      return "I can help you with:\n• Inventory management\n• Hospital details\n• Medicine tracking\n• Stock alerts\n• AI predictions\n• Medicine transfers";
    }


    return "I can assist with MediSync AI features like Hospitals, Inventory, Medicines, Alerts, Transfers and AI Insights.";
  }



  function sendMessage() {

    if (!message.trim()) return;


    const userMessage = {
      sender: "user",
      text: message
    };


    const botMessage = {
      sender: "bot",
      text: getReply(message)
    };


    setChat(prev => [
      ...prev,
      userMessage,
      botMessage
    ]);


    setMessage("");

  }



  return (
    <>


      {!open && (

        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
        >
          <MessageCircle size={28}/>
        </button>

      )}



      {open && (

        <div className="fixed bottom-6 right-6 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border z-50">

          <div className="flex justify-between items-center bg-blue-700 text-white p-4 rounded-t-2xl">

            <h3 className="font-semibold">
              MediSync AI Assistant
            </h3>


            <button onClick={() => setOpen(false)}>
              <X size={20}/>
            </button>

          </div>




          <div className="h-72 overflow-y-auto p-4 space-y-3">


            {chat.map((msg,index)=>(

              <div
                key={index}
                className={`p-3 rounded-xl text-sm whitespace-pre-line ${
                  msg.sender === "user"
                  ? "bg-blue-100 ml-8"
                  : "bg-gray-100 mr-8"
                }`}
              >

                {msg.text}

              </div>

            ))}


          </div>




          <div className="flex border-t p-3 gap-2">


            <input

              value={message}

              onChange={(e)=>setMessage(e.target.value)}

              onKeyDown={(e)=>{
                if(e.key==="Enter")
                  sendMessage();
              }}

              placeholder="Ask something..."

              className="flex-1 border rounded-xl px-3"

            />



            <button

              onClick={sendMessage}

              className="bg-blue-700 text-white p-3 rounded-xl"

            >

              <Send size={18}/>

            </button>


          </div>



        </div>

      )}


    </>
  );
}