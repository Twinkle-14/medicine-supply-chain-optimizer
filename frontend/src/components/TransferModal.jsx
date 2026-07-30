import { useEffect, useState } from "react";
import {
  executeTransfer,
  getHospitals,
} from "../services/api";

export default function TransferModal({
  open,
  onClose,
  transfer,
  onSuccess,
}) {
  const [hospitals, setHospitals] = useState([]);
  const [toHospital, setToHospital] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadHospitals();
    }
  }, [open]);

  async function loadHospitals() {
    try {
      const data = await getHospitals();

      // Don't show the source hospital in the destination list
      setHospitals(
        data.filter((h) => h.id !== transfer?.hospital_id)
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit() {
    if (!toHospital) {
      alert("Please select a destination hospital.");
      return;
    }

    try {
      setLoading(true);

      await executeTransfer({
        from_hospital_id: transfer.hospital_id,
        to_hospital_id: Number(toHospital),
        medicine_id: transfer.medicine_id,
        quantity: Number(quantity),
      });

      alert("Transfer completed successfully.");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[450px] p-6 shadow-xl">

        <h2 className="text-2xl font-bold mb-6">
          Execute Transfer
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block text-sm mb-2">
              Source Hospital
            </label>

            <input
              value={transfer?.hospital || ""}
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Medicine
            </label>

            <input
              value={transfer?.medicine || ""}
              disabled
              className="w-full border rounded-lg p-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Destination Hospital
            </label>

            <select
              className="w-full border rounded-lg p-3"
              value={toHospital}
              onChange={(e) => setToHospital(e.target.value)}
            >
              <option value="">
                Select Hospital
              </option>

              {hospitals.map((hospital) => (
                <option
                  key={hospital.id}
                  value={hospital.id}
                >
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Processing..." : "Confirm Transfer"}
          </button>

        </div>

      </div>
    </div>
  );
}