import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import "./ExpenseChart.css";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

function ExpenseChart({ expenses }) {
  const categoryData = Object.values(expenses.reduce((acc, expense) => {
    const key = expense.category || "Other";
    acc[key] = acc[key] || { name: key, value: 0 };
    acc[key].value += Number(expense.amount || 0);
    return acc;
  }, {}));

  return <div className="chart-card">
    <h3 className="chart-title">📊 Spending by category</h3>
    {!categoryData.length ? <div className="chart-empty">No category data yet.</div> : (
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={105} label>
            {categoryData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )}
  </div>;
}
export default ExpenseChart;
