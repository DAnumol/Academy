# Fee Management Setup Instructions

## Files Created

### Backend
✅ `Backend/models/FeePayment.js` - Database model
✅ `Backend/migrations/20251211110306-create-fee-payments.js` - Migration file
✅ `Backend/controllers/feePaymentController.js` - API controller
✅ `Backend/routes/feePayments.js` - API routes
✅ `Backend/utils/generateId.js` - Updated with feePayment ID
✅ `Backend/models/Student.js` - Updated associations
✅ `Backend/models/Course.js` - Updated associations
✅ `Backend/server.js` - Added fee payment routes

### Frontend
✅ `Frontend/src/services/feePaymentService.js` - API service
✅ `Frontend/src/features/fees/pages/FeeManagementPage.jsx` - Main page

---

## Setup Steps

### 1. Run Database Migration
```bash
cd Backend
npx sequelize-cli db:migrate
```

### 2. Restart Backend Server
```bash
cd Backend
npm start
```

### 3. Add Route to Frontend

Add to `Frontend/src/App.jsx` or your routing file:
```javascript
import FeeManagementPage from '@/features/fees/pages/FeeManagementPage';

// In your routes:
<Route path="/fees" element={<FeeManagementPage />} />
```

### 4. Add to Navigation Menu

Add to your sidebar/navigation:
```javascript
{
  name: 'Fee Management',
  path: '/fees',
  icon: DollarSignIcon, // or any icon
  roles: ['admin', 'staff']
}
```

---

## How to Use

### Record Payment
1. Click "Add Payment" button
2. Select student and course
3. Enter amount (e.g., 500)
4. Select payment method
5. Add transaction ID (optional)
6. Click Submit

### View Student Details
1. Click on any student row
2. See total fees, paid amount, pending amount
3. View complete payment history

### Filter Students
- Filter by fee status (Completed/Pending)
- Search by student name or roll number

---

## Example Usage

**Scenario**: Student pays fees in installments

1. **First Payment**:
   - Amount: ₹500
   - Method: Cash
   - Result: Paid ₹500, Pending ₹9,500 (if total is ₹10,000)

2. **Second Payment**:
   - Amount: ₹700
   - Method: UPI
   - Result: Paid ₹1,200, Pending ₹8,800

3. **Grid Shows**:
   - Total Fees: ₹10,000
   - Paid: ₹1,200
   - Pending: ₹8,800
   - Status: Pending (Yellow badge)

4. **When Fully Paid**:
   - Status changes to: Completed (Green badge)

---

## API Endpoints

- `POST /api/fee-payments` - Record payment
- `GET /api/fee-payments/overview` - Get all students fee status
- `GET /api/fee-payments/student/:studentId` - Get student fee details
- `GET /api/fee-payments` - Get all payments with filters
- `DELETE /api/fee-payments/:id` - Delete payment

---

## Database Schema

**Table**: `fee_payments`

| Column | Type | Description |
|--------|------|-------------|
| paymentId | STRING(20) | Primary key |
| studentId | STRING(20) | Foreign key to students |
| courseId | STRING(10) | Foreign key to courses |
| amount | DECIMAL(10,2) | Payment amount |
| paymentDate | DATE | Date of payment |
| paymentMethod | ENUM | Cash/Card/UPI/Bank Transfer/Cheque |
| transactionId | STRING(100) | Optional transaction reference |
| remarks | TEXT | Optional notes |
| receiptNumber | STRING(50) | Auto-generated receipt number |
| collectedBy | STRING(10) | Staff who collected payment |
| status | BOOLEAN | Active/Inactive |

---

## Features

✅ Multiple installment payments
✅ Automatic pending calculation
✅ Payment history tracking
✅ Receipt number generation
✅ Multiple payment methods
✅ Filter by status
✅ Search functionality
✅ Detailed student view
✅ Color-coded status badges

---

## Testing

1. Create a course with fees (e.g., ₹10,000)
2. Enroll a student in that course
3. Record first payment (₹500)
4. Check grid shows: Paid ₹500, Pending ₹9,500
5. Record second payment (₹700)
6. Check grid shows: Paid ₹1,200, Pending ₹8,800
7. Click student to view payment history
8. Verify both payments are listed

---

## Troubleshooting

**Issue**: Migration fails
- Solution: Check if `students` and `courses` tables exist first

**Issue**: Cannot see fee management page
- Solution: Add route to App.jsx and navigation menu

**Issue**: "FeePayment is not associated to Student"
- Solution: Restart backend server after model changes

**Issue**: Pending amount shows negative
- Solution: This is handled in code, shows 0 if negative

---

## Next Steps (Optional Enhancements)

1. Add payment receipt PDF generation
2. Add SMS/Email notification on payment
3. Add payment reminders for pending fees
4. Add bulk payment import from Excel
5. Add payment analytics dashboard
6. Add late fee calculation
7. Add discount/scholarship management

---

## Support

If you encounter any issues:
1. Check backend console for errors
2. Check browser console for frontend errors
3. Verify migration ran successfully
4. Ensure all associations are correct
5. Restart both backend and frontend servers
