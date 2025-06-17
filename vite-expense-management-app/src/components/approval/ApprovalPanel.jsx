import { useEffect, useState } from "react";
import api from "../../services/api";
import ApprovalTable from "./ApprovalTable";
import { useMyContext } from "../../store/ContextApi";
import { Button } from "@mui/material";

const ApprovalPanel = () => {
  const { isAdmin } = useMyContext();

  const [approvalList, setApprovalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 6;

  const fetchApprovals = async (page = 0) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: pageSize.toString(),
        sortOrder: "asc",
        status: isAdmin ? "approved" : "pending",
        level: isAdmin ? "MANAGER" : "",
      });

      const url = `/api/expenses/request-list?${params.toString()}`;
      console.log("Fetching:", url);

      const response = await api.get(url);
      setApprovalList(response.data.content || []);
      setPageNumber(response.data.pageNumber);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching approvals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals(pageNumber);
  }, [pageNumber]);

  const handlePrev = () => {
    if (pageNumber > 0) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages - 1) {
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-800'>
        Pending Approvals
      </h2>

      <ApprovalTable approvals={approvalList} loading={loading} />

      <div className='flex justify-center gap-4 mt-6'>
        <Button
          variant='outlined'
          onClick={handlePrev}
          disabled={pageNumber === 0}
        >
          Previous
        </Button>
        <span className='text-gray-700 font-medium self-center'>
          Page {pageNumber + 1} of {totalPages}
        </span>
        <Button
          variant='outlined'
          onClick={handleNext}
          disabled={pageNumber >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ApprovalPanel;
