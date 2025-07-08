import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button, Divider } from "@mui/material";
import { motion } from "framer-motion";

const AuditLogViewModal = ({ open, setOpen, auditLog }) => {
  if (!auditLog) return null;

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
      <Dialog as='div' className='relative z-50' onClose={setOpen}>
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
                    <Detail label='ID' value={auditLog.id} />
                    <Detail label='Entity Name' value={auditLog.entityName} />
                    <Detail label='Entity ID' value={auditLog.entityId} />
                    <Detail label='IP Address' value={auditLog.deviceIp} />
                    <Detail label='Action' value={auditLog.action} />
                    <Detail label='Performed By' value={auditLog.performedBy} />
                    <Detail
                      label='Timestamp'
                      value={new Date(auditLog.timestamp).toLocaleString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    />
                  </div>

                  <Divider className='my-4' />

                  <div className='text-sm text-gray-700'>
                    <Section
                      title='Old Value'
                      content={formatJson(auditLog.oldValue)}
                    />
                    <Section
                      title='New Value'
                      content={formatJson(auditLog.newValue)}
                    />
                  </div>

                  <div className='mt-6 flex justify-end gap-3'>
                    <Button variant='contained' onClick={() => setOpen(false)}>
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

const Section = ({ title, content }) => (
  <div className='mb-4'>
    <p className='text-sm font-medium text-gray-800 mb-1'>{title}</p>
    <pre className='p-3 border rounded bg-gray-50 text-gray-700 whitespace-pre-wrap overflow-auto text-xs max-h-64'>
      {content}
    </pre>
  </div>
);

export default AuditLogViewModal;
