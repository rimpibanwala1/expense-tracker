import "./ExpenseForm.css";

function ExpenseForm({
  showForm, expenseName, setExpenseName, amount, setAmount, category, setCategory,
  saveExpense, isEditing, onCancel,
}) {
  if (!showForm) return null;

  return (
    <form className="expense-form" onSubmit={(e) => { e.preventDefault(); saveExpense(); }}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">TRANSACTION</p>
          <h3 className="form-title">{isEditing ? "Edit expense" : "Add new expense"}</h3>
        </div>
        {isEditing && <button className="cancel-link" type="button" onClick={onCancel}>Cancel</button>}
      </div>

      <div className="form-grid">
        <label>Expense name<input className="form-input" type="text" placeholder="e.g. Lunch" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} autoFocus /></label>
        <label>Amount<input className="form-input" type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        <label>Category<select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Food</option><option>Travel</option><option>Shopping</option><option>Entertainment</option><option>Other</option>
        </select></label>
      </div>
      <button className="save-btn" type="submit">{isEditing ? "Save changes" : "Add expense"}</button>
    </form>
  );
}
export default ExpenseForm;
