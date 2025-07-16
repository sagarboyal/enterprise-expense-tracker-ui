import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button, Divider } from "@mui/material";
import { motion } from "framer-motion";

const AuditLogViewModal = ({ open, onClose, log }) => {
  if (!log) return null;

  const formatJson = (jsonString) => {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, 2);
    } catch {
      return jsonString || "—";
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
        </Transition.Child>

        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all font-[Poppins]'>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dialog.Title className='text-2xl font-semibold text-gray-800 mb-4'>
                    Audit Log Details
                  </Dialog.Title>

                  <div className='grid grid-cols-2 gap-4 text-sm text-gray-700'>
                    <Detail label='ID' value={log.id} />
                    <Detail label='Entity Name' value={log.entityName} />
                    <Detail label='Entity ID' value={log.entityId} />
                    <Detail label='IP Address' value={log.deviceIp} />
                    <Detail label='Action' value={log.action} />
                    <Detail label='Performed By' value={log.performedBy} />
                    <Detail
                      label='Timestamp'
                      value={new Date(log.timestamp).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    />
                  </div>

                  <div className='my-6 flex items-center text-sm text-gray-500 font-medium'>
                    <div className='flex-grow border-t border-gray-300' />
                    <span className='mx-4 whitespace-nowrap'>Changes</span>
                    <div className='flex-grow border-t border-gray-300' />
                  </div>

                  <Section
                    title='Changes'
                    oldContent={formatJson(log.oldValue)}
                    newContent={formatJson(log.newValue)}
                  />

                  <div className='mt-6 flex justify-end gap-3'>
                    <Button
                      variant='contained'
                      onClick={onClose}
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#333",
                        },
                        fontFamily: "Poppins",
                        textTransform: "none",
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className='font-medium text-gray-800'>{label}</p>
    <p className='text-gray-600 break-all'>{value ?? "—"}</p>
  </div>
);

const Section = ({ title, oldContent = "", newContent = "" }) => {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");

  const maxLength = Math.max(oldLines.length, newLines.length);

  return (
    <div className='mb-6 font-[Poppins]'>
      <p className='text-sm font-semibold text-gray-800 mb-2'>{title}</p>

      <div className='grid grid-cols-2 text-xs font-mono border rounded overflow-hidden max-h-64'>
        {/* Old Value Column */}
        <div className='bg-gray-50 border-r border-gray-200'>
          <div className='p-2 font-semibold text-gray-600 bg-gray-100 border-b'>
            Old Value
          </div>
          {Array.from({ length: maxLength }).map((_, idx) => {
            const oldLine = oldLines[idx] ?? "";
            const newLine = newLines[idx] ?? "";

            const trimmedOld = oldLine.trim();
            const trimmedNew = newLine.trim();

            let bgColor = "bg-white text-gray-700";
            if (trimmedOld && !trimmedNew) {
              bgColor = "bg-rose-100 text-rose-700"; // Deleted
            } else if (trimmedOld && trimmedNew && trimmedOld !== trimmedNew) {
              bgColor = "bg-yellow-100 text-yellow-800"; // Changed
            }

            return (
              <div
                key={`old-${idx}`}
                className={`px-3 py-1 border-b border-gray-200 whitespace-pre-wrap ${bgColor}`}
              >
                {oldLine || <span className='text-gray-300'>—</span>}
              </div>
            );
          })}
        </div>

        {/* New Value Column */}
        <div className='bg-gray-50'>
          <div className='p-2 font-semibold text-gray-600 bg-gray-100 border-b'>
            New Value
          </div>
          {Array.from({ length: maxLength }).map((_, idx) => {
            const oldLine = oldLines[idx] ?? "";
            const newLine = newLines[idx] ?? "";

            const trimmedOld = oldLine.trim();
            const trimmedNew = newLine.trim();

            let bgColor = "bg-white text-gray-700";
            if (!trimmedOld && trimmedNew) {
              bgColor = "bg-green-100 text-green-700"; // Added
            } else if (trimmedOld && trimmedNew && trimmedOld !== trimmedNew) {
              bgColor = "bg-green-100 text-green-700";
            }

            return (
              <div
                key={`new-${idx}`}
                className={`px-3 py-1 border-b border-gray-200 whitespace-pre-wrap ${bgColor}`}
              >
                {newLine || <span className='text-gray-300'>—</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuditLogViewModal;
