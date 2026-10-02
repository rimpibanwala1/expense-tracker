import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./MonthlyChart.css";

function MonthlyChart({ expenses }) {
  const grouped = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    if (Number.isNaN(date.getTime())) return acc;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + Number(expense.amount || 0);
    return acc;
  }, {});

  const monthlyData = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, amount]) => {
      const [year, month] = key.split("-");
      return { month: new Date(Number(year), Number(month) - 1, 1).toLocaleString(undefined, { month: "short", year: "2-digit" }), amount };
    });

  return <div className="chart-card">
    <h3 className="chart-title">📈 Monthly expenses</h3>
    {!monthlyData.length ? <div className="chart-empty">No monthly data yet.</div> : (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Expense"]} />
          <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>;
}
export default MonthlyChart;
