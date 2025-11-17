const generateId = (prefix, length = 3) => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  return `${prefix}${timestamp}${random}`;
};

const generateIds = {
  user: () => generateId('U'),
  student: () => generateId('STU'),
  staff: () => generateId('STF'),
  course: () => generateId('C'),
  subject: () => generateId('SUB'),
  batch: () => generateId('B'),
  class: () => generateId('CLS'),
  timetable: () => generateId('TT'),
  questionPaper: () => generateId('QP'),
  attendance: () => generateId('ATT'),
  material: () => generateId('MAT'),
  exam: () => generateId('EXM'),
  result: () => generateId('RES'),
  notification: () => generateId('NOT')
};

module.exports = generateIds;