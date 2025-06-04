import Introduction from "./common/Introduction";

const HomePage = () => {
  const dummyExpense = {
    title: "Sample Expense",
    amount: 150.75,
    expenseDate: "2023-10-01",
    category: "Travel",
    status: "APPROVED",
    message: "Approved for reimbursement",
  };
  return <Introduction />;
};
export default HomePage;
