import { useEffect, useState } from "react";
import api from "../../services/api";
import { Card, Button, CardContent, Pagination } from "@mui/material";
import { motion } from "framer-motion";
import AuditLogFilterDialog from "./AuditLogFilterDialog";
import AuditLogViewModal from "./AuditLogViewModal";
import { FaFilter } from "react-icons/fa";
import { AiOutlineAudit } from "react-icons/ai";

const AuditLogDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async (pageNumber = 1, appliedFilters = {}) => {
    setLoading(true);
    const queryParams = {
      pageNumber: pageNumber - 1,
      pageSize: 10,
      sortBy: "id",
      sortOrder: "desc",
      ...appliedFilters,
    };

    console.log("📡 Requesting /api/admin/audit-log with params:", queryParams);

    try {
      const res = await api.get("/api/admin/audit-log", {
        params: queryParams,
      });
      setLogs(res.data.content);
      setPage(res.data.pageNumber + 1);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchLogs(1, newFilters);
  };

  return (
    <div className='p-6 font-[Poppins]'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold flex items-center gap-2'>
          <AiOutlineAudit className='text-indigo-600 text-3xl' />
          Audit Log Dashboard
        </h2>
        <Button
          variant='outlined'
          onClick={() => setOpenFilter(true)}
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

      {loading ? (
        <p className='text-gray-500 animate-pulse'>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className='text-gray-500'>No audit logs available.</p>
      ) : (
        <div className='space-y-4'>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className='rounded-2xl shadow-md border border-gray-200 transition'>
                <CardContent className='space-y-2 text-sm text-gray-700'>
                  <div className='space-y-1.5 text-sm text-gray-700'>
                    {/* Entity + Timestamp */}
                    <div className='flex justify-between items-start'>
                      <div>
                        <p className='font-semibold text-indigo-600'>
                          {log.entityName}{" "}
                          <span className='text-gray-600 font-medium'>
                            #{log.entityId}
                          </span>
                        </p>
                      </div>
                      <span className='text-xs text-gray-400 whitespace-nowrap'>
                        {new Date(log.timestamp).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    {/* Action */}
                    <div className='flex items-start gap-2'>
                      <span className='min-w-[100px] text-gray-600 font-medium'>
                        Action:
                      </span>
                      <span className='text-gray-800'>{log.action}</span>
                    </div>

                    {/* Performed By */}
                    <div className='flex items-start gap-2'>
                      <span className='min-w-[100px] text-gray-600 font-medium'>
                        Performed By:
                      </span>
                      <span className='text-gray-800'>{log.performedBy}</span>
                    </div>

                    {/* IP Address */}
                    <div className='flex items-start gap-2'>
                      <span className='min-w-[100px] text-gray-600 font-medium'>
                        IP Address:
                      </span>
                      <span className='text-gray-800'>{log.deviceIp}</span>
                    </div>

                    {/* Old Value */}
                    {log.oldValue && (
                      <div className='mt-2 bg-rose-50 border-l-4 border-rose-400 px-3 py-2 text-xs text-rose-700 whitespace-pre-wrap rounded-md'>
                        <strong className='block mb-1'>Old Value:</strong>
                        {log.oldValue}
                      </div>
                    )}

                    {/* New Value */}
                    {log.newValue && (
                      <div className='bg-green-50 border-l-4 border-green-400 px-3 py-2 text-xs text-green-700 whitespace-pre-wrap rounded-md'>
                        <strong className='block mb-1'>New Value:</strong>
                        {log.newValue}
                      </div>
                    )}
                  </div>

                  <div className='flex justify-end pt-2'>
                    <Button
                      size='small'
                      variant='text'
                      onClick={() => setSelectedLog(log)}
                      startIcon={
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth={2}
                          viewBox='0 0 24 24'
                        >
                          <path d='M15 12H3m0 0l6-6m-6 6l6 6' />
                        </svg>
                      }
                      sx={{
                        fontFamily: "Poppins",
                        textTransform: "none",
                        color: "#4f46e5",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "8px",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "rgba(79, 70, 229, 0.1)",
                          transform: "scale(1.03)",
                          textDecoration: "none",
                        },
                        "& .MuiButton-startIcon": {
                          marginRight: "6px",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className='flex justify-end mt-6'>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => fetchLogs(value, filters)}
            color='primary'
            shape='rounded'
          />
        </div>
      )}

      <AuditLogFilterDialog
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onApply={handleApplyFilters}
      />

      {selectedLog && (
        <AuditLogViewModal
          open={!!selectedLog}
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default AuditLogDashboard;
