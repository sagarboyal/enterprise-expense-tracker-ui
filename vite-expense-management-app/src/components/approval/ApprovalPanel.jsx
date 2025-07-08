import { useEffect, useState } from "react";
import api from "../../services/api";
import ApprovalTable from "./ApprovalTable";
import { useMyContext } from "../../store/ContextApi";
import { InputAdornment, IconButton, Button, TextField } from "@mui/material";
import { MdNavigateBefore, MdNavigateNext, MdClose } from "react-icons/md";
import { FaFilter, FaSearch } from "react-icons/fa";
import AdvancedFilterDialog from "./AdvanceFilterDialog";
import { GoTasklist } from "react-icons/go";

const ApprovalPanel = () => {
  const { isAdmin } = useMyContext();

  const [approvalList, setApprovalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState([]);

  const pageSize = 10;

  const fetchApprovals = async (page = 0, appliedFilters = filters) => {
    try {
      setLoading(true);

      const cleanFilters = Object.fromEntries(
        Object.entries(appliedFilters).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      const params = new URLSearchParams({
        pageNumber: page,
        pageSize,
        sortOrder: "desc",
        sortBy: "id",
        ...(isAdmin
          ? { level: "MANAGER", status: "APPROVED" }
          : { status: "PENDING", level: "MANAGER" }),
        ...cleanFilters,
      });

      const url = `/api/expenses/request-list?${params}`;
      const response = await api.get(url);
      console.log("Fetching Approvals with URL:", url);

      setApprovalList(response.data.content || []);
      setPageNumber(response.data.pageNumber);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching approvals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    fetchApprovals(0, newFilters);
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, title: searchQuery };
    setFilters(updatedFilters);
    fetchApprovals(0, updatedFilters);
  };

  useEffect(() => {
    fetchApprovals(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/public/categories?pageSize=100");
        setCategories(response.data.content);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
    <>
      <AdvancedFilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterApply}
        categories={categories}
      />

      <div className='p-6 space-y-6 font-[Poppins]'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <h2 className='flex items-center gap-2 text-2xl sm:text-3xl font-semibold text-black font-[Poppins]'>
            <GoTasklist className='text-3xl' />
            Pending Approvals
          </h2>

          <div className='flex gap-3 items-center'>
            <TextField
              size='small'
              variant='outlined'
              placeholder='Search by title'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                fontFamily: "Poppins",
                input: { fontFamily: "Poppins", fontSize: "14px" },
              }}
              InputProps={{
                endAdornment: searchQuery && (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        setSearchQuery("");
                        const updatedFilters = { ...filters, title: "" };
                        setFilters(updatedFilters);
                        fetchApprovals(0, updatedFilters);
                      }}
                      size='small'
                    >
                      <MdClose />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant='contained'
              color='primary'
              startIcon={<FaSearch />}
              onClick={handleSearch}
              sx={{
                textTransform: "none",
                fontFamily: "Poppins",
                backgroundColor: "black",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Search
            </Button>
            <Button
              variant='outlined'
              onClick={() => setFilterOpen(true)}
              startIcon={<FaFilter />}
              sx={{
                fontFamily: "Poppins",
                textTransform: "none",
                color: "black",
                borderColor: "black",
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "#f3f3f3",
                },
              }}
            >
              Advanced Filter
            </Button>
          </div>
        </div>

        <ApprovalTable approvals={approvalList} loading={loading} />

        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-4 mt-6'>
            <Button
              variant='outlined'
              onClick={handlePrev}
              disabled={pageNumber === 0}
              startIcon={<MdNavigateBefore />}
              sx={{
                textTransform: "none",
                fontFamily: "Poppins",
                fontSize: "14px",
                color: "black",
                borderColor: "black",
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "#f3f3f3",
                },
              }}
            >
              Previous
            </Button>

            <span className='text-sm sm:text-base text-black font-medium'>
              Page <span className='text-indigo-600'>{pageNumber + 1}</span> of{" "}
              <span className='text-indigo-600'>{totalPages}</span>
            </span>

            <Button
              variant='outlined'
              onClick={handleNext}
              disabled={pageNumber >= totalPages - 1}
              endIcon={<MdNavigateNext />}
              sx={{
                textTransform: "none",
                fontFamily: "Poppins",
                fontSize: "14px",
                color: "black",
                borderColor: "black",
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "#f3f3f3",
                },
              }}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ApprovalPanel;
