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
                  <div className='flex justify-between items-center'>
                    <p className='text-gray-800 font-medium'>
                      <span className='text-indigo-600'>{log.entityName}</span>{" "}
                      - #{log.entityId}
                    </p>
                    <span className='text-xs text-gray-400'>
                      {new Date(log.timestamp).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p>
                    <strong>Action:</strong> {log.action}
                  </p>
                  <p>
                    <strong>Performed By:</strong> {log.performedBy}
                  </p>
                  <p>
                    <strong>IP:</strong> {log.deviceIp}
                  </p>
                  {log.oldValue && (
                    <p className='text-rose-600 text-xs break-words'>
                      <strong>Old:</strong> {log.oldValue}
                    </p>
                  )}
                  {log.newValue && (
                    <p className='text-green-600 text-xs break-words'>
                      <strong>New:</strong> {log.newValue}
                    </p>
                  )}

                  <div className='flex justify-end pt-2'>
                    <Button
                      size='small'
                      variant='text'
                      onClick={() => setSelectedLog(log)}
                      sx={{
                        fontFamily: "Poppins",
                        textTransform: "none",
                        color: "#4f46e5",
                        "&:hover": {
                          textDecoration: "underline",
                          backgroundColor: "transparent",
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
          log={selectedLog}
          open={!!selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default AuditLogDashboard;
