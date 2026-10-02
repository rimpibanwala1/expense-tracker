import "./Dashboard.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExpenseForm from "../ExpenseForm";
import ExpenseList from "../ExpenseList";
import ExpenseChart from "../ExpenseChart";
import MonthlyChart from "../MonthlyChart";

const DEFAULT_INCOME = 30000;

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("spendwise:darkMode") === "true");
  const [showForm, setShowForm] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(DEFAULT_INCOME);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login", { replace: true });
        return;
      }
      setUser(currentUser);
      setExpenses(readJSON(`spendwise:${currentUser.uid}:expenses`, []));
      setIncome(Number(localStorage.getItem(`spendwise:${currentUser.uid}:income`) ?? DEFAULT_INCOME));
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`spendwise:${user.uid}:expenses`, JSON.stringify(expenses));
  }, [expenses, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`spendwise:${user.uid}:income`, String(income));
  }, [income, user]);

  useEffect(() => {
    localStorage.setItem("spendwise:darkMode", String(darkMode));
  }, [darkMode]);

  const totalExpense = useMemo(
    () => expenses.reduce((total, item) => total + Number(item.amount || 0), 0),
    [expenses]
  );
  const averageExpense = expenses.length ? totalExpense / expenses.length : 0;
  const balance = income - totalExpense;

  const resetForm = () => {
    setExpenseName("");
    setAmount("");
    setCategory("Food");
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
  };

  const saveExpense = () => {
    const cleanName = expenseName.trim();
    const numericAmount = Number(amount);

    if (!cleanName || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Enter a valid expense name and amount.");
      return;
    }

    if (isEditing) {
      setExpenses((current) =>
        current.map((item) =>
          item.id === editId
            ? { ...item, name: cleanName, amount: numericAmount, category }
            : item
        )
      );
      toast.success("Expense updated.");
    } else {
      setExpenses((current) => [
        ...current,
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
          name: cleanName,
          amount: numericAmount,
          category,
          date: new Date().toISOString(),
        },
      ]);
      toast.success("Expense added.");
    }

    resetForm();
  };

  const deleteExpense = (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setExpenses((current) => current.filter((expense) => expense.id !== id));
    toast.success("Expense deleted.");
  };

  const editExpense = (expense) => {
    setExpenseName(expense.name);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setEditId(expense.id);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportCSV = () => {
    if (!expenses.length) {
      toast.error("No expenses available.");
      return;
    }

    const escapeCSV = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = expenses.map((expense) => [
      escapeCSV(expense.name),
      Number(expense.amount).toFixed(2),
      escapeCSV(expense.category),
      escapeCSV(new Date(expense.date).toLocaleString()),
    ]);

    const csv = [
      ["Name", "Amount", "Category", "Date"].map(escapeCSV).join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\r\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "SpendWise_Expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported.");
  };

  const downloadPDF = () => {
    if (!expenses.length) {
      toast.error("No expenses available.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SpendWise Expense Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`Income: INR ${income.toFixed(2)}`, 14, 32);
    doc.text(`Total Expense: INR ${totalExpense.toFixed(2)}`, 14, 40);
    doc.text(`Balance: INR ${balance.toFixed(2)}`, 14, 48);

    autoTable(doc, {
      startY: 58,
      head: [["Name", "Amount", "Category", "Date"]],
      body: expenses.map((expense) => [
        expense.name,
        `INR ${Number(expense.amount).toFixed(2)}`,
        expense.category,
        new Date(expense.date).toLocaleString(),
      ]),
    });

    doc.save("SpendWise_Report.pdf");
    toast.success("PDF downloaded.");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      <main className="dashboard-card">
        <header className="header">
          <div>
            <h1 className="logo-title">SpendWise</h1>
            <p className="tagline">A simple, private expense tracker</p>
            <p className="welcome">Welcome, {user?.email || "there"}</p>
          </div>
          <div className="header-buttons">
            <button className="icon-btn" type="button" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle dark mode">
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button className="icon-btn" type="button" onClick={handleLogout} aria-label="Log out">↪</button>
          </div>
        </header>

     <section className="stats-grid" aria-label="Expense summary">
  <div className="stat-card income-card">
    <span className="stat-icon">💰</span>
    <p>Income</p>
    <h2>₹{income.toLocaleString("en-IN")}</h2>
  </div>

  <div className="stat-card total-expense-card">
    <span className="stat-icon">📉</span>
    <p>Total Expense</p>
    <h2>
      ₹{totalExpense.toLocaleString("en-IN", {
        maximumFractionDigits: 2
      })}
    </h2>
  </div>

  <div className="stat-card balance-card">
    <span className="stat-icon">⚖️</span>
    <p>Current Balance</p>
    <h2>
      ₹{balance.toLocaleString("en-IN", {
        maximumFractionDigits: 2
      })}
    </h2>
  </div>

  <div className="stat-card average-card">
    <span className="stat-icon">📊</span>
    <p>Average Expense</p>
    <h2>
      ₹{averageExpense.toLocaleString("en-IN", {
        maximumFractionDigits: 2
      })}
    </h2>
  </div>
</section>

        <section className="form-section">
          <label htmlFor="income">Monthly income</label>
          <input id="income" className="dashboard-input" type="number" min="0" step="0.01" value={income} onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))} />
        </section>

        <div className="action-buttons">
          <button className="action-btn add-btn" type="button" onClick={() => setShowForm((value) => !value)}>➕ {showForm ? "Close Form" : "Add Expense"}</button>
          <button className="action-btn csv-btn" type="button" onClick={exportCSV}>📄 Export CSV</button>
          <button className="action-btn pdf-btn" type="button" onClick={downloadPDF}>📑 Download PDF</button>
        </div>

        <ExpenseForm
          showForm={showForm}
          expenseName={expenseName}
          setExpenseName={setExpenseName}
          amount={amount}
          setAmount={setAmount}
          category={category}
          setCategory={setCategory}
          saveExpense={saveExpense}
          isEditing={isEditing}
          onCancel={resetForm}
        />

        <section className="search-row" aria-label="Expense filters">
          <input className="dashboard-input" type="search" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="dashboard-input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">All categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </section>

        <section className="chart-grid">
          <ExpenseChart expenses={expenses} />
          <MonthlyChart expenses={expenses} />
        </section>

        <ExpenseList expenses={expenses} deleteExpense={deleteExpense} editExpense={editExpense} search={search} filterCategory={filterCategory} />
      </main>
      <ToastContainer position="top-right" autoClose={2200} theme={darkMode ? "dark" : "light"} />
    </div>
  );
}

export default Dashboard;
