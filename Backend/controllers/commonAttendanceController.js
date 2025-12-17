const db = require('../models');
const { sendSuccess, sendError } = require('../utils/response');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const getAllCommonAttendance = async (req, res) => {
  try {
    const { batchId, month, year } = req.query;
    const whereClause = {};
    
    if (batchId) whereClause.batchId = batchId;
    
    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      whereClause.date = {
        [db.Sequelize.Op.between]: [startDate, endDate]
      };
    }
    
    const commonAttendance = await db.CommonAttendance.findAll({
      where: whereClause,
      include: [{ model: db.Batch, as: 'batch' }],
      order: [['date', 'DESC']]
    });
    return sendSuccess(res, 'Common attendance retrieved successfully', { data: commonAttendance });
  } catch (error) {
    console.error('Error fetching common attendance:', error);
    return sendError(res, 500, 'Failed to fetch common attendance');
  }
};

const getCommonAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const commonAttendance = await db.CommonAttendance.findByPk(id, {
      include: [{ model: db.Batch, as: 'batch' }]
    });
    if (!commonAttendance) {
      return sendError(res, 404, 'Common attendance not found');
    }
    return sendSuccess(res, 'Common attendance retrieved successfully', commonAttendance);
  } catch (error) {
    console.error('Error fetching common attendance:', error);
    return sendError(res, 500, 'Failed to fetch common attendance');
  }
};

const createCommonAttendance = async (req, res) => {
  try {
    const { batchId, date, records, status } = req.body;

    let commonAttendanceId;
    let exists = true;
    let counter = 1;
    
    while (exists) {
      commonAttendanceId = `CA${String(counter).padStart(3, '0')}`;
      const existing = await db.CommonAttendance.findByPk(commonAttendanceId);
      if (!existing) exists = false;
      else counter++;
    }

    const commonAttendance = await db.CommonAttendance.create({
      commonAttendanceId,
      batchId,
      date,
      records,
      status: status || 'Active'
    });

    return sendSuccess(res, 'Common attendance created successfully', commonAttendance, 201);
  } catch (error) {
    console.error('Error creating common attendance:', error);
    return sendError(res, 500, 'Failed to create common attendance');
  }
};

const updateCommonAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { batchId, date, records, status } = req.body;

    const commonAttendance = await db.CommonAttendance.findByPk(id);
    if (!commonAttendance) {
      return sendError(res, 404, 'Common attendance not found');
    }

    await commonAttendance.update({
      batchId: batchId || commonAttendance.batchId,
      date: date || commonAttendance.date,
      records: records || commonAttendance.records,
      status: status !== undefined ? status : commonAttendance.status
    });

    return sendSuccess(res, 'Common attendance updated successfully', commonAttendance);
  } catch (error) {
    console.error('Error updating common attendance:', error);
    return sendError(res, 500, 'Failed to update common attendance');
  }
};

const deleteCommonAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const commonAttendance = await db.CommonAttendance.findByPk(id);
    if (!commonAttendance) {
      return sendError(res, 404, 'Common attendance not found');
    }
    await commonAttendance.destroy();
    return sendSuccess(res, 'Common attendance deleted successfully');
  } catch (error) {
    console.error('Error deleting common attendance:', error);
    return sendError(res, 500, 'Failed to delete common attendance');
  }
};

const exportCommonAttendancePDF = async (req, res) => {
  try {
    const { batchId, month, year } = req.query;
    
    if (!batchId || !month || !year) {
      return sendError(res, 400, 'Batch, month and year are required');
    }
    
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const attendanceData = await db.CommonAttendance.findAll({
      where: {
        batchId,
        date: {
          [db.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      include: [{ model: db.Batch, as: 'batch' }],
      order: [['date', 'ASC']]
    });
    
    if (attendanceData.length === 0) {
      return sendError(res, 404, 'No attendance data found');
    }
    
    const studentIds = [...new Set(attendanceData.flatMap(r => r.records.map(s => s.studentId)))];
    const students = await db.Student.findAll({
      where: { studentId: studentIds },
      attributes: ['studentId', 'name']
    });
    const studentMap = {};
    students.forEach(s => studentMap[s.studentId] = s.name);
    
    const doc = new PDFDocument({ margin: 50 });
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    const filename = `Attendance_${attendanceData[0].batch.batchName}_${monthName}_${year}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    doc.pipe(res);
    
    doc.fontSize(20).text('Common Attendance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Batch: ${attendanceData[0].batch.batchName}`);
    doc.text(`Month: ${monthName} ${year}`);
    doc.text(`Total Days: ${attendanceData.length}`);
    doc.moveDown();
    
    attendanceData.forEach((record, index) => {
      doc.fontSize(14).text(`Date: ${record.date}`, { underline: true });
      doc.moveDown(0.5);
      
      record.records.forEach((student, idx) => {
        const studentName = studentMap[student.studentId] || 'Unknown';
        doc.fontSize(10).text(`${idx + 1}. ${studentName} (${student.studentId}) - ${student.attendanceStatus}`);
      });
      
      doc.moveDown();
      
      if (index < attendanceData.length - 1 && doc.y > 650) {
        doc.addPage();
      }
    });
    
    doc.end();
  } catch (error) {
    console.error('Error exporting attendance:', error);
    return sendError(res, 500, 'Failed to export attendance');
  }
};

const exportCommonAttendanceExcel = async (req, res) => {
  try {
    const { batchId, month, year } = req.query;
    
    if (!batchId || !month || !year) {
      return sendError(res, 400, 'Batch, month and year are required');
    }
    
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const attendanceData = await db.CommonAttendance.findAll({
      where: {
        batchId,
        date: {
          [db.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      include: [{ model: db.Batch, as: 'batch' }],
      order: [['date', 'ASC']]
    });
    
    if (attendanceData.length === 0) {
      return sendError(res, 404, 'No attendance data found');
    }
    
    const studentIds = [...new Set(attendanceData.flatMap(r => r.records.map(s => s.studentId)))];
    const students = await db.Student.findAll({
      where: { studentId: studentIds },
      attributes: ['studentId', 'name']
    });
    const studentMap = {};
    students.forEach(s => studentMap[s.studentId] = s.name);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Student ID', key: 'studentId', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];
    
    worksheet.getRow(1).font = { bold: true };
    
    attendanceData.forEach(record => {
      record.records.forEach(student => {
        worksheet.addRow({
          date: record.date,
          studentName: studentMap[student.studentId] || 'Unknown',
          studentId: student.studentId,
          status: student.attendanceStatus
        });
      });
    });
    
    const filename = `Attendance_${attendanceData[0].batch.batchName}_${monthName}_${year}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting attendance:', error);
    return sendError(res, 500, 'Failed to export attendance');
  }
};

module.exports = {
  getAllCommonAttendance,
  getCommonAttendanceById,
  createCommonAttendance,
  updateCommonAttendance,
  deleteCommonAttendance,
  exportCommonAttendancePDF,
  exportCommonAttendanceExcel
};
