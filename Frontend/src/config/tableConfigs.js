import React from 'react'
import { getStatusColor, getRoleColor } from '@utils/badgeColors'
import LookupCell from '../components/ui/LookupCell'

// User table configuration
export const userTableConfig = {
  title: 'User Management',
  description: 'Manage and track your team members and their access',
  columns: [
    {
      key: 'name',
      label: 'User',
      type: 'user'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'badge',
      getBadgeColor: getRoleColor
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['name', 'email'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Active', label: 'Active', selected: false },
      { value: 'Inactive', label: 'Inactive', selected: false },
      { value: 'Pending', label: 'Pending', selected: false }
    ],
    role: [
      { value: 'Admin', label: 'Admin', selected: false },
      { value: 'Staff', label: 'Staff', selected: false },
      { value: 'Student', label: 'Student', selected: false }
    ],
  }
}

export const staffTableConfig = {
  title: 'Staff Management',
  description: 'Manage and track your staff members',
  columns: [
    {
      key: 'staffId',
      label: 'Staff ID'
    },
    {
      key: 'name',
      label: 'Staff Name'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    },
    {
      key: 'phone',
      label: 'Phone Number'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'qualification',
      label: 'Qualification'
    }
  ],
  searchFields: ['name', 'email', 'qualification'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'active', label: 'Active', selected: false },
      { value: 'inactive', label: 'Inactive', selected: false },
      { value: 'on-leave', label: 'On Leave', selected: false }
    ]
  }
}

export const studentTableConfig = {
  title: 'Student Management',
  description: 'Manage and track your students',
  columns: [
    {
      key: 'name',
      label: 'Name',
      type: 'user'
    },
    {
      key: 'rollNo',
      label: 'Roll Number'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phone',
      label: 'Phone'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['name', 'email', 'rollNo'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Active', label: 'Active', selected: false },
      { value: 'Inactive', label: 'Inactive', selected: false },
      { value: 'Pending', label: 'Pending', selected: false }
    ]
  }
}

export const timetableTableConfig = {
  title: 'Timetable Management',
  description: 'Manage class schedules and timetables',
  columns: [
    {
      key: 'batchId',
      label: 'Batch ID'
    },
    {
      key: 'weekStartDate',
      label: 'Week Start Date'
    },
    {
      key: 'schedule',
      label: 'Schedule Details',
      render: (value, item) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return React.createElement('span', { className: 'text-gray-500 italic' }, 'No schedule')
        }
        
        return React.createElement('div', { className: 'space-y-1' }, 
          value.map((scheduleItem, index) => 
            React.createElement('div', 
              { 
                key: index, 
                className: 'text-xs flex items-center gap-1' 
              },
              React.createElement('span', { className: 'font-medium' }, `${scheduleItem.day}:`),
              React.createElement(LookupCell, { ids: scheduleItem.subjectId, type: 'subject' }),
              React.createElement('span', null, `(${scheduleItem.startTime}-${scheduleItem.endTime})`),
              React.createElement(LookupCell, { ids: scheduleItem.staffId, type: 'staff' }),
              React.createElement('span', null, `Room ${scheduleItem.roomNo}`)
            )
          )
        )
      }
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['batchId'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Active', label: 'Active', selected: false },
      { value: 'Inactive', label: 'Inactive', selected: false },
      { value: 'Draft', label: 'Draft', selected: false }
    ]
  }
}

export const attendanceTableConfig = {
  title: 'Attendance Management',
  description: 'Track student attendance records',
  columns: [
    {
      key: 'batchId',
      label: 'Batch ID'
    },
    {
      key: 'subjectId',
      label: 'Subject',
      render: (value, item) => {
        return React.createElement(LookupCell, { ids: value, type: 'subject' })
      }
    },
    {
      key: 'date',
      label: 'Date'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['batchId', 'subjectId'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Active', label: 'Active', selected: false },
      { value: 'Inactive', label: 'Inactive', selected: false },
      { value: 'Pending', label: 'Pending', selected: false }
    ]
  }
}

export const resultTableConfig = {
  title: 'Results Management',
  description: 'Manage student exam results',
  columns: [
    {
      key: 'studentId',
      label: 'Student ID'
    },
    {
      key: 'examId',
      label: 'Exam ID'
    },
    {
      key: 'totalMarks',
      label: 'Total Marks'
    },
    {
      key: 'obtainedMarks',
      label: 'Obtained Marks'
    },
    {
      key: 'percentage',
      label: 'Percentage'
    },
    {
      key: 'grade',
      label: 'Grade'
    },
    {
      key: 'violationCount',
      label: 'Violations'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['studentId', 'examId'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Published', label: 'Published', selected: false },
      { value: 'Pending', label: 'Pending', selected: false },
      { value: 'On Hold', label: 'On Hold', selected: false }
    ]
  }
}

export const courseTableConfig = {
  title: 'Course Management',
  description: 'Manage courses and curriculum',
  columns: [
    {
      key: 'courseName',
      label: 'Course Name'
    },
    {
      key: 'duration',
      label: 'Duration'
    },
    {
      key: 'fees',
      label: 'Fees'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['courseName'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Active', label: 'Active', selected: false },
      { value: 'Inactive', label: 'Inactive', selected: false },
      { value: 'Pending', label: 'Pending', selected: false }
    ]
  }
}

export const batchTableConfig = {
  title: 'Batch Management',
  description: 'Manage student batches',
  columns: [
    {
      key: 'batchName',
      label: 'Batch Name'
    },
    {
      key: 'courseId',
      label: 'Course ID'
    },
    {
      key: 'startDate',
      label: 'Start Date'
    },
    {
      key: 'endDate',
      label: 'End Date'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['batchName'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Active', label: 'Active', selected: false },
      { value: 'Inactive', label: 'Inactive', selected: false },
      { value: 'Pending', label: 'Pending', selected: false }
    ]
  }
}

export const subjectTableConfig = {
  title: 'Subject Management',
  description: 'Manage subjects and curriculum',
  columns: [
    {
      key: 'name',
      label: 'Subject Name'
    },
    {
      key: 'code',
      label: 'Subject Code'
    },
    {
      key: 'staffId',
      label: 'Assigned Staff',
      render: (value, item) => {
        return React.createElement(LookupCell, { ids: value, type: 'staff' })
      }
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['name', 'code'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Active', label: 'Active', selected: false },
      { value: 'Inactive', label: 'Inactive', selected: false },
      { value: 'Pending', label: 'Pending', selected: false }
    ]
  }
}

export const examTableConfig = {
  title: 'Exam Management',
  description: 'Manage exams and assessments',
  columns: [
    {
      key: 'questionPaper',
      label: 'Question Paper',
      render: (value, item) => value?.title || 'N/A'
    },
    {
      key: 'batch',
      label: 'Batch',
      render: (value, item) => value?.batchName || 'N/A'
    },
    {
      key: 'date',
      label: 'Exam Date'
    },
   {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    },
  ],
  searchFields: ['questionPaper.title', 'batch.batchName'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'scheduled', label: 'Scheduled', selected: false },
      { value: 'ongoing', label: 'Ongoing', selected: false },
      { value: 'completed', label: 'Completed', selected: false },
      { value: 'cancelled', label: 'Cancelled', selected: false }
    ]
  }
}

export const questionpaperTableConfig = {
  title: 'Question Paper Management',
  description: 'Manage question papers and assessments',
  columns: [
    {
      key: 'title',
      label: 'Title'
    },
    {
      key: 'courseId',
      label: 'Course',
      render: (value, item) => {
        return value ? React.createElement(LookupCell, { ids: value, type: 'course' }) : 'N/A'
      }
    },
    {
      key: 'subjectId',
      label: 'Subject',
      render: (value, item) => {
        return React.createElement(LookupCell, { ids: value, type: 'subject' })
      }
    },
    {
      key: 'totalMarks',
      label: 'Total Marks'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['title', 'courseId'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Active', label: 'Active', selected: false },
      { value: 'Inactive', label: 'Inactive', selected: false },
      { value: 'Draft', label: 'Draft', selected: false }
    ]
  }
}

export const studymaterialTableConfig = {
  title: 'Study Material Management',
  description: 'Manage study materials and resources',
  columns: [
    {
      key: 'title',
      label: 'Title'
    },
    {
      key: 'description',
      label: 'Description'
    },
    {
      key: 'subjectId',
      label: 'Subject',
      render: (value, item) => {
        return React.createElement(LookupCell, { ids: value, type: 'subject' })
      }
    },
     {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    },
    // {
    //   key: 'createdAt',
    //   label: 'Created At',
    //   type: 'date'
    // }
  ],
  searchFields: ['title', 'description'],
  filterConfig: {}
}

export const classTableConfig = {
  title: 'Class Management',
  description: 'Manage classes and sessions',
  columns: [
    {
      key: 'className',
      label: 'Class Name'
    },
    {
      key: 'batchId',
      label: 'Batch ID'
    },
    {
      key: 'staffIds',
      label: 'Staff',
      render: (value, item) => {
        return React.createElement(LookupCell, { ids: value, type: 'staff' })
      }
    },
    {
      key: 'subjectIds',
      label: 'Subject',
      render: (value, item) => {
        return React.createElement(LookupCell, { ids: value, type: 'subject' })
      }
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeColor: getStatusColor
    }
  ],
  searchFields: ['className'],
  statusField: 'status',
  filterConfig: {
    status: [
      { value: 'Active', label: 'Active', selected: false },
      { value: 'Inactive', label: 'Inactive', selected: false },
      { value: 'Pending', label: 'Pending', selected: false }
    ]
  }
}

