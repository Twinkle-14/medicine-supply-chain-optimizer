export default function KpiCard({
  title,
  value,
  subtitle,
  color = "blue",
}) {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-600",
    },
  };

  const c = colors[color];

  return (
    <div
      className={`rounded-2xl border ${c.border} bg-white p-6 shadow-sm hover:shadow-md transition`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-5`}
      >
        <div className={`w-3 h-3 rounded-full ${c.text.replace("text", "bg")}`} />
      </div>

      <p className="text-sm text-gray-500">{title}</p>

      <h2 className={`text-4xl font-bold mt-2 ${c.text}`}>
        {value}
      </h2>

      <p className="mt-2 text-gray-500 text-sm">
        {subtitle}
      </p>
    </div>
  );
}