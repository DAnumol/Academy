import { useState } from 'react';
import GenericDataTable from '@components/ui/GenericDataTable';
import GenericFormModal from '@components/ui/GenericFormModal';
import { useGenericCRUD } from '@hooks/useGenericCRUD';
import { feePaymentService } from '@/services/feePaymentService';
import { showToast } from '@/utils/toast';
import SearchableStudentSelect from './SearchableStudentSelect';
import { useAuth } from '@/hooks/useAuth';

const FeeManagementTable = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBypassConfirm, setShowBypassConfirm] = useState(false);
  
  const isStudent = user?.role === 'student';

  const { useList, useCreate } = useGenericCRUD({
    queryKey: 'feeOverview',
    service: {
      getAll: feePaymentService.getOverview,
      create: feePaymentService.create
    },
    messages: {
      create: 'Payment recorded successfully!'
    }
  });

  const { data: response = [], isLoading, refetch } = useList();
  const feeData = response.data || response || [];
  const createMutation = useCreate();

  const columns = [
    { key: 'rollNo', label: 'Roll No', sortable: true },
    { key: 'name', label: 'Student Name', sortable: true },
    { key: 'courseName', label: 'Course', sortable: true },
    { 
      key: 'totalFees', 
      label: 'Total Fees', 
      sortable: true,
      render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`
    },
    { 
      key: 'totalPaid', 
      label: 'Paid', 
      sortable: true,
      render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`
    },
    { 
      key: 'pendingAmount', 
      label: 'Pending', 
      sortable: true,
      render: (value) => `₹${parseFloat(value || 0).toFixed(2)}`
    },
    { 
      key: 'feeStatus', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'lastPaymentDate', label: 'Last Payment', sortable: true }
  ];

  const formFields = [
    {
      name: 'studentId',
      label: 'Student',
      type: 'custom',
      required: true,
      component: SearchableStudentSelect,
      section: 'basic',
      sectionTitle: 'Student Information'
    },
    {
      name: 'courseId',
      label: 'Course',
      type: 'select',
      required: true,
      apiEndpoint: '/courses',
      valueField: 'courseId',
      labelField: 'courseName',
      section: 'basic'
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
      placeholder: 'Enter amount',
      section: 'payment',
      sectionTitle: 'Payment Details'
    },
    {
      name: 'paymentDate',
      label: 'Payment Date',
      type: 'date',
      required: true,
      section: 'payment'
    },
    {
      name: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      required: true,
      options: [
        { value: 'Cash', label: 'Cash' },
        { value: 'Card', label: 'Card' },
        { value: 'UPI', label: 'UPI' },
        { value: 'Bank Transfer', label: 'Bank Transfer' },
        { value: 'Cheque', label: 'Cheque' }
      ],
      section: 'payment'
    },
    {
      name: 'transactionId',
      label: 'Transaction ID',
      type: 'text',
      placeholder: 'Optional',
      section: 'payment'
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      placeholder: 'Optional notes',
      section: 'payment'
    }
  ];

  const handleAddPayment = () => setShowAddModal(true);
  
  const handleViewDetails = async (student) => {
    try {
      const response = await feePaymentService.getStudentSummary(student.studentId);
      const data = response.data || response;
      setSelectedStudent(data);
      setShowDetailsModal(true);
    } catch (error) {
      showToast.error('Failed to load student details');
    }
  };

  const handleFormSubmit = async (data) => {
    await createMutation.mutateAsync(data);
    setShowAddModal(false);
  };

  const handleBypass = async (student) => {
    try {
      const response = await feePaymentService.getStudentSummary(student.studentId);
      const data = response.data || response;
      setSelectedStudent(data);
      setShowBypassConfirm(true);
    } catch (error) {
      showToast.error('Failed to load student details');
    }
  };

  const handleBypassFees = async () => {
    try {
      await feePaymentService.create({
        studentId: selectedStudent.student.studentId,
        courseId: selectedStudent.student.courseId || null,
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        remarks: 'Fee bypassed - Set to ₹0'
      });
      showToast.success('Fees bypassed successfully!');
      setShowBypassConfirm(false);
      refetch();
    } catch (error) {
      showToast.error('Failed to bypass fees');
    }
  };

  return (
    <>
      <GenericDataTable
        data={feeData}
        columns={columns}
        title="Fee Management"
        description="Track student fee payments and pending amounts"
        isLoading={isLoading}
        onRefetch={refetch}
        onAdd={!isStudent ? handleAddPayment : undefined}
        onView={handleViewDetails}
        onBypass={!isStudent ? handleBypass : undefined}
        searchFields={['name', 'rollNo']}
        actions={isStudent ? ['view'] : ['view', 'bypass']}
      />

      <GenericFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleFormSubmit}
        title="Record Fee Payment"
        fields={formFields}
        isLoading={createMutation.isPending}
      />

      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Student Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Name: {selectedStudent.student?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Roll No: {selectedStudent.student?.rollNo}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Course: {selectedStudent.student?.courseName}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Fees</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">₹{selectedStudent.totalFees?.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Paid</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-300">₹{selectedStudent.totalPaid?.toFixed(2)}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">₹{selectedStudent.pendingAmount?.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment History</h3>
                <div className="space-y-2">
                  {selectedStudent.paymentHistory && selectedStudent.paymentHistory.length > 0 ? (
                    selectedStudent.paymentHistory.map((payment, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">₹{parseFloat(payment.amount).toFixed(2)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{payment.paymentMethod} - {payment.receiptNumber}</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No payment history available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBypassConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirm Bypass</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to bypass fees for this student? This will set the fees to ₹0.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBypassConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleBypassFees}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeeManagementTable;
