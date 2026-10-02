import "./ExpenseList.css";

function ExpenseList({ expenses, deleteExpense, editExpense, search, filterCategory }) {
  const query = String(search || "").trim().toLowerCase();
  const filteredExpenses = expenses
    .filter((expense) => expense.name.toLowerCase().includes(query))
    .filter((expense) => filterCategory === "All" || expense.category === filterCategory)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <section className="expense-list">
      <div className="list-heading">
        <div>
          <p className="eyebrow">TRANSACTIONS</p>
          <h3 className="expense-title">Recent expenses</h3>
        </div>
        <span className="count-badge">{filteredExpenses.length}</span>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <span>🧾</span>
          <h4>{expenses.length ? "No matching expenses" : "No expenses yet"}</h4>
          <p>{expenses.length ? "Try a different search or category." : "Add your first expense to get started."}</p>
        </div>
      ) : (
        <div className="expense-items">
          {filteredExpenses.map((expense) => (
            <article className="expense-card" key={expense.id}>
              <div className="expense-info">
                <h4>{expense.name}</h4>
                <span className="category-badge">{expense.category}</span>
                <p className="expense-date">
                  {new Date(expense.date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="expense-actions">
                <strong className="expense-price">₹{Number(expense.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
                <div className="row-actions">
                  <button className="edit-btn" type="button" onClick={() => editExpense(expense)}>Edit</button>
                  <button className="delete-btn" type="button" onClick={() => deleteExpense(expense.id)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
export default ExpenseList;
