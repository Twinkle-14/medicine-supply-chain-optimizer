import { useEffect, useState } from "react";
import { getHospitals, getMedicines, getInventory, getAIPredictions } from "../services/api";

export default function Analytics() {
  const [stats, setStats] = useState({
    hospitals: 0,
    medicines: 0,
    inventory: 0,
    critical: 0,
    low: 0,
    healthy: 0,
    overstock: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const [
        hospitals,
        medicines,
        inventory,
        predictions,
      ] = await Promise.all([
        getHospitals(),
        getMedicines(),
        getInventory(),
        getAIPredictions(),
      ]);

      setStats({
        hospitals: hospitals.length,
        medicines: medicines.length,
        inventory: inventory.length,
        critical: predictions.filter(
          (p) => p.status === "Critical"
        ).length,
        low: predictions.filter(
          (p) => p.status === "Low Stock"
        ).length,
        healthy: predictions.filter(
          (p) => p.status === "Healthy"
        ).length,
        overstock: predictions.filter(
          (p) => p.status === "Overstock"
        ).length,
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Analytics
        </h1>

        <p className="text-gray-500 mt-1">
          Overall system statistics and AI health overview
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Hospitals
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {stats.hospitals}
          </h2>

        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Medicines
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {stats.medicines}
          </h2>

        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <p className="text-gray-500 text-sm">
            Inventory Records
          </p>

          <h2 className="text-4xl font-bold text-purple-600 mt-2">
            {stats.inventory}
          </h2>

        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <div className="bg-red-50 rounded-2xl p-6">

          <h3 className="text-red-700 font-semibold">
            Critical
          </h3>

          <p className="text-4xl font-bold text-red-700 mt-2">
            {stats.critical}
          </p>

        </div>

        <div className="bg-yellow-50 rounded-2xl p-6">

          <h3 className="text-yellow-700 font-semibold">
            Low Stock
          </h3>

          <p className="text-4xl font-bold text-yellow-700 mt-2">
            {stats.low}
          </p>

        </div>

        <div className="bg-green-50 rounded-2xl p-6">

          <h3 className="text-green-700 font-semibold">
            Healthy
          </h3>

          <p className="text-4xl font-bold text-green-700 mt-2">
            {stats.healthy}
          </p>

        </div>

        <div className="bg-orange-50 rounded-2xl p-6">

          <h3 className="text-orange-700 font-semibold">
            Overstock
          </h3>

          <p className="text-4xl font-bold text-orange-700 mt-2">
            {stats.overstock}
          </p>

        </div>

      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-8">

        <h2 className="text-2xl font-bold mb-6">
          AI Summary
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between border-b pb-3">
            <span>Total Hospitals</span>
            <span className="font-semibold">
              {stats.hospitals}
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Total Medicines</span>
            <span className="font-semibold">
              {stats.medicines}
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Total Inventory Records</span>
            <span className="font-semibold">
              {stats.inventory}
            </span>
          </div>
                    <div className="flex justify-between border-b pb-3">
            <span>Critical Medicines</span>
            <span className="font-semibold text-red-600">
              {stats.critical}
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Low Stock Medicines</span>
            <span className="font-semibold text-yellow-600">
              {stats.low}
            </span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Healthy Medicines</span>
            <span className="font-semibold text-green-600">
              {stats.healthy}
            </span>
          </div>

          <div className="flex justify-between gap-4 border-b pb-3">
            <span>Overstock Medicines</span>
            <span className="font-semibold text-orange-600">
              {stats.overstock}
            </span>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            System Health
          </h3>

          <p className="text-gray-700">
            AI continuously monitors medicine availability across hospitals
            and identifies shortages, healthy stock levels, and overstocked
            inventory.
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Recommendation
          </h3>

          <p className="text-gray-700">
            Review Critical and Low Stock medicines daily and use the
            Transfers module to redistribute excess inventory before placing
            new purchase orders.
          </p>
        </div>

      </div>

    </div>
  );
}