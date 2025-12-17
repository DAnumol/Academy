# Fee Management System - Implementation Guide

## Overview
Track student fee payments with installment support, showing pending and completed amounts.

---

## Database Schema

### 1. Add Fee Payment Table

**Model: FeePayment**
```javascript
// Backend/models/FeePayment.js
module.exports = (sequelize, DataTypes) => {
  const FeePayment = sequelize.define('FeePayment', {
    paymentId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    studentId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'students',
        key: 'studentId'
      }
    },
    courseId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'courses',
        key: 'courseId'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'),
      allowNull: false,
      defaultValue: 'Cash'
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    collectedBy: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'fee_payments',
    timestamps: true
  });

  FeePayment.associate = (models) => {
    FeePayment.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    FeePayment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    FeePayment.belongsTo(models.User, { foreignKey: 'collectedBy', as: 'collector' });
  };

  return FeePayment;
};
```

### 2. Migration File

```javascript
// Backend/migrations/YYYYMMDDHHMMSS-create-fee-payments.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fee_payments', {
      paymentId: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      studentId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'students',
          key: 'studentId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      courseId: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'courses',
          key: 'courseId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      paymentMethod: {
        type: Sequelize.ENUM('Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'),
        allowNull: false,
        defaultValue: 'Cash'
      },
      transactionId: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      receiptNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      },
      collectedBy: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId'
        }
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fee_payments');
  }
};
```

### 3. Update Student Model Associations

```javascript
// Add to Student.associate in Backend/models/Student.js
Student.hasMany(models.FeePayment, { foreignKey: 'studentId', as: 'feePayments' });
```

### 4. Update Course Model Associations

```javascript
// Add to Course.associate in Backend/models/Course.js
Course.hasMany(models.FeePayment, { foreignKey: 'courseId', as: 'feePayments' });
```

---

## Backend Implementation

### 1. Generate ID Utility

```javascript
// Add to Backend/utils/generateId.js
feePayment: () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FP${timestamp}${random}`;
}
```

### 2. Fee Payment Controller

```javascript
// Backend/controllers/feePaymentController.js
const { FeePayment, Student, Course, User } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');
const { Op } = require('sequelize');

// Create Payment
const createPayment = async (req, res) => {
  try {
    const { studentId, courseId, amount, paymentDate, paymentMethod, transactionId, remarks } = req.body;
    const { userId } = req.user;

    const student = await Student.findByPk(studentId);
    if (!student) return sendError(res, 404, 'Student not found');

    const course = await Course.findByPk(courseId);
    if (!course) return sendError(res, 404, 'Course not found');

    const receiptNumber = `RCP${Date.now()}`;

    const payment = await FeePayment.create({
      paymentId: generateIds.feePayment(),
      studentId,
      courseId,
      amount: parseFloat(amount),
      paymentDate,
      paymentMethod,
      transactionId,
      remarks,
      receiptNumber,
      collectedBy: userId,
      status: true
    });

    sendSuccess(res, 'Payment recorded successfully', payment, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to record payment', error);
  }
};

// Get All Payments with Filters
const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, studentId, courseId, paymentMethod, startDate, endDate } = req.query;
    
    const where = {};
    if (studentId) where.studentId = studentId;
    if (courseId) where.courseId = courseId;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (startDate && endDate) {
      where.paymentDate = { [Op.between]: [startDate, endDate] };
    }

    const payments = await FeePayment.findAndCountAll({
      where,
      include: [
        { model: Student, as: 'student', attributes: ['name', 'rollNo'] },
        { model: Course, as: 'course', attributes: ['courseName', 'fees'] },
        { model: User, as: 'collector', attributes: ['username'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['paymentDate', 'DESC']]
    });

    sendSuccess(res, 'Payments retrieved successfully', {
      payments: payments.rows,
      totalCount: payments.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(payments.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get payments', error);
  }
};

// Get Student Fee Summary
const getStudentFeeSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({
      where: { studentId },
      include: [{ model: Course, as: 'course', attributes: ['courseName', 'fees'] }]
    });

    if (!student) return sendError(res, 404, 'Student not found');

    const payments = await FeePayment.findAll({
      where: { studentId },
      order: [['paymentDate', 'ASC']]
    });

    const totalFees = parseFloat(student.course?.fees || 0);
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const pendingAmount = totalFees - totalPaid;
    const feeStatus = pendingAmount <= 0 ? 'Completed' : 'Pending';

    sendSuccess(res, 'Fee summary retrieved successfully', {
      student: {
        studentId: student.studentId,
        name: student.name,
        rollNo: student.rollNo,
        courseName: student.course?.courseName
      },
      totalFees,
      totalPaid,
      pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
      feeStatus,
      paymentHistory: payments
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get fee summary', error);
  }
};

// Get Fee Overview (All Students)
const getFeeOverview = async (req, res) => {
  try {
    const { courseId, batchId, status } = req.query;

    const studentWhere = {};
    if (courseId) studentWhere.courseId = courseId;
    if (batchId) studentWhere.batchId = batchId;

    const students = await Student.findAll({
      where: studentWhere,
      include: [
        { model: Course, as: 'course', attributes: ['courseName', 'fees'] },
        { model: FeePayment, as: 'feePayments' }
      ]
    });

    const feeData = students.map(student => {
      const totalFees = parseFloat(student.course?.fees || 0);
      const totalPaid = student.feePayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const pendingAmount = totalFees - totalPaid;
      const feeStatus = pendingAmount <= 0 ? 'Completed' : 'Pending';

      return {
        studentId: student.studentId,
        name: student.name,
        rollNo: student.rollNo,
        courseName: student.course?.courseName,
        totalFees,
        totalPaid,
        pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
        feeStatus,
        lastPaymentDate: student.feePayments[student.feePayments.length - 1]?.paymentDate || null
      };
    });

    // Filter by status if provided
    const filteredData = status 
      ? feeData.filter(f => f.feeStatus === status)
      : feeData;

    sendSuccess(res, 'Fee overview retrieved successfully', filteredData);
  } catch (error) {
    sendError(res, 500, 'Failed to get fee overview', error);
  }
};

// Delete Payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeePayment.destroy({ where: { paymentId: id } });
    
    if (!deleted) return sendError(res, 404, 'Payment not found');
    sendSuccess(res, 'Payment deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete payment', error);
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getStudentFeeSummary,
  getFeeOverview,
  deletePayment
};
```

### 3. Routes

```javascript
// Backend/routes/feePayments.js
const express = require('express');
const router = express.Router();
const feePaymentController = require('../controllers/feePaymentController');
const { authenticate } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');
const { PERMISSIONS } = require('../config/rolePermissions');

router.post('/', authenticate, checkPermission(PERMISSIONS.CREATE_FEE_PAYMENT), feePaymentController.createPayment);
router.get('/', authenticate, checkPermission(PERMISSIONS.VIEW_FEE_PAYMENTS), feePaymentController.getAllPayments);
router.get('/overview', authenticate, checkPermission(PERMISSIONS.VIEW_FEE_PAYMENTS), feePaymentController.getFeeOverview);
router.get('/student/:studentId', authenticate, feePaymentController.getStudentFeeSummary);
router.delete('/:id', authenticate, checkPermission(PERMISSIONS.DELETE_FEE_PAYMENT), feePaymentController.deletePayment);

module.exports = router;
```

### 4. Add to server.js

```javascript
// Backend/server.js
const feePaymentRoutes = require('./routes/feePayments');
app.use('/api/fee-payments', feePaymentRoutes);
```

### 5. Add Permissions

```javascript
// Backend/config/rolePermissions.js - Add to PERMISSIONS object
CREATE_FEE_PAYMENT: 'create_fee_payment',
VIEW_FEE_PAYMENTS: 'view_fee_payments',
DELETE_FEE_PAYMENT: 'delete_fee_payment',

// Add to role permissions
admin: [...existing, 'create_fee_payment', 'view_fee_payments', 'delete_fee_payment'],
staff: [...existing, 'create_fee_payment', 'view_fee_payments'],
```

---

## Frontend Implementation

### 1. Service

```javascript
// Frontend/src/services/feePaymentService.js
import api from './api';

export const feePaymentService = {
  create: (data) => api.post('/fee-payments', data),
  getAll: (params) => api.get('/fee-payments', { params }),
  getOverview: (params) => api.get('/fee-payments/overview', { params }),
  getStudentSummary: (studentId) => api.get(`/fee-payments/student/${studentId}`),
  delete: (id) => api.delete(`/fee-payments/${id}`)
};
```

### 2. Form Config

```javascript
// Frontend/src/config/formConfigs.js
export const feePaymentFormConfig = {
  title: 'Record Fee Payment',
  fields: [
    {
      name: 'studentId',
      label: 'Student',
      type: 'select',
      required: true,
      apiEndpoint: '/students',
      valueField: 'studentId',
      labelField: 'name',
      section: 'basic'
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
      section: 'payment'
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
      options: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'],
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
  ]
};
```

### 3. Table Config

```javascript
// Frontend/src/config/tableConfigs.js
export const feeOverviewTableConfig = {
  title: 'Fee Management',
  description: 'Track student fee payments and pending amounts',
  columns: [
    { key: 'rollNo', label: 'Roll No', sortable: true },
    { key: 'name', label: 'Student Name', sortable: true },
    { key: 'courseName', label: 'Course', sortable: true },
    { 
      key: 'totalFees', 
      label: 'Total Fees', 
      sortable: true,
      render: (value) => `₹${value.toFixed(2)}`
    },
    { 
      key: 'totalPaid', 
      label: 'Paid', 
      sortable: true,
      render: (value) => `₹${value.toFixed(2)}`
    },
    { 
      key: 'pendingAmount', 
      label: 'Pending', 
      sortable: true,
      render: (value) => `₹${value.toFixed(2)}`
    },
    { 
      key: 'feeStatus', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'lastPaymentDate', label: 'Last Payment', sortable: true }
  ],
  searchFields: ['name', 'rollNo'],
  filterConfig: {
    feeStatus: {
      label: 'Fee Status',
      options: ['Completed', 'Pending']
    }
  }
};
```

### 4. Fee Management Page

```javascript
// Frontend/src/features/fees/pages/FeeManagementPage.jsx
import { useState } from 'react';
import GenericDataTable from '@components/ui/GenericDataTable';
import GenericFormModal from '@components/ui/GenericFormModal';
import { useGenericCRUD } from '@hooks/useGenericCRUD';
import { feePaymentService } from '@/services/feePaymentService';
import { feeOverviewTableConfig } from '@config/tableConfigs';
import { feePaymentFormConfig } from '@config/formConfigs';

const FeeManagementPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const { data: feeData = [], isLoading, refetch } = useList();
  const createMutation = useCreate();

  const handleAddPayment = () => setShowAddModal(true);
  
  const handleViewDetails = async (student) => {
    const response = await feePaymentService.getStudentSummary(student.studentId);
    setSelectedStudent(response.data);
  };

  const handleFormSubmit = async (data) => {
    await createMutation.mutateAsync(data);
    setShowAddModal(false);
  };

  return (
    <>
      <GenericDataTable
        data={feeData}
        columns={feeOverviewTableConfig.columns}
        title={feeOverviewTableConfig.title}
        description={feeOverviewTableConfig.description}
        isLoading={isLoading}
        onRefetch={refetch}
        onAdd={handleAddPayment}
        onView={handleViewDetails}
        searchFields={feeOverviewTableConfig.searchFields}
        filterConfig={feeOverviewTableConfig.filterConfig}
        actions={['view']}
      />

      <GenericFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleFormSubmit}
        title={feePaymentFormConfig.title}
        fields={feePaymentFormConfig.fields}
        isLoading={createMutation.isPending}
      />
    </>
  );
};

export default FeeManagementPage;
```

---

## Payment Process Flow

### 1. Record Payment
1. Staff selects student
2. System shows course fees and pending amount
3. Staff enters payment amount
4. Selects payment method
5. Adds transaction ID (if applicable)
6. System generates receipt number
7. Payment recorded

### 2. View Fee Status
1. Grid shows all students
2. Displays: Total Fees, Paid, Pending, Status
3. Color coding: Green (Completed), Yellow (Pending)
4. Click student to view payment history

### 3. Payment History
1. Shows all installments
2. Date, Amount, Method, Receipt Number
3. Running balance after each payment

---

## Key Features

✅ Multiple installment payments (500, then 700, etc.)
✅ Automatic pending amount calculation
✅ Fee status tracking (Completed/Pending)
✅ Payment history per student
✅ Receipt number generation
✅ Multiple payment methods
✅ Filter by status, course, date range
✅ Transaction ID tracking

---

## Implementation Timeline

**Day 1**: Database setup (migration, models)
**Day 2**: Backend API (controller, routes)
**Day 3**: Frontend UI (table, form)
**Day 4**: Testing and refinements

**Total**: 4 days
