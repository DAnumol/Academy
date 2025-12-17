// User form configuration
export const userFormConfig = {
  title: 'Create New User',
  fields: [

    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true,
      section: 'basic',
      sectionTitle: 'User Information',
      validation: {
        minLength: {
          value: 2,
          message: 'Name must be at least 2 characters'
        }
      }
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      section: 'basic',
      validation: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
      section: 'basic',
      validation: {
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters'
        },
        pattern: {
          value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
          message: 'Password must include uppercase, lowercase and a number'
        }
      }
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      placeholder: 'Select role',
      required: true,
      section: 'permissions',
      sectionTitle: 'Role & Permissions',
      options: [
        { value: 'admin', label: 'admin' },
        { value: 'staff', label: 'staff' },
        { value: 'student', label: 'student' }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      section: 'permissions',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
}

// subject form configuration
export const subjectFormConfig = {
  title: 'Create New Subject',
  fields: [
    {
      name: 'name',
      label: 'Subject Name',
      type: 'text',
      placeholder: 'Enter subject name',
      required: true,
      section: 'subjectInfo',
      sectionTitle: 'Subject Information',
      validation: {
        minLength: {
          value: 2,
          message: 'Name must be at least 2 characters'
        }
      }
    },
    {
      name: 'code',
      label: 'Subject Code',
      type: 'text',
      placeholder: 'Enter subject code',
      required: true,
      section: 'subjectInfo',
      sectionTitle: 'Subject Information',
      validation: {
        minLength: {
          value: 2,
          message: 'Code must be at least 2 characters'
        }
      }
    },
    {
      name: 'staffIds',
      label: 'Assigned Staff',
      type: 'multiselect',
      placeholder: 'Select staff',
      required: true,
      section: 'subjectManagement',
      sectionTitle: 'Staff Assignment & Status',
      apiEndpoint: '/staff',
      valueField: 'staffId',
      labelField: 'name'
    },

    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      section: 'subjectManagement',
      sectionTitle: 'Staff Assignment & Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
};

// course form configuration
export const courseFormConfig = {
  title: 'Create New Course',
  fields: [
    {
      name: 'courseName',
      label: 'Course Name',
      type: 'text',
      placeholder: 'Enter course name',
      required: true,
      section: 'courseInfo',
      sectionTitle: 'Course Information'
    },
    {
      name: 'duration',
      label: 'Duration',
      type: 'text',
      placeholder: 'Enter duration (e.g. 6 months)',
      required: true,
      section: 'courseInfo',

    },
    {
      name: 'fees',
      label: 'Fees',
      type: 'number',
      placeholder: 'Enter course fee',
      required: true,
      section: 'courseInfo',

    },
    {
      name: 'eligibility',
      label: 'Eligibility',
      type: 'text',
      placeholder: 'Enter eligibility criteria',
      required: true,
      section: 'courseInfo',

    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter course description',
      required: true,
      newline: true,
      section: 'courseInfo',

    },

    {
      name: 'subjectIds',
      label: 'Subjects',
      type: 'multiselect',
      placeholder: 'Select subjects',
      required: true,
      section: 'courseManagement',
      sectionTitle: 'Subject Mapping & Status',
      apiEndpoint: '/subjects',
      valueField: 'subjectId',
      labelField: 'name'
    },
   
     {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
       section: 'courseManagement',
      sectionTitle: 'Subject Mapping & Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
};

// class form configuration

export const classFormConfig = {
  title: 'Create New Class',
  fields: [
    {
      name: 'className',
      label: 'Class Name',
      type: 'text',
      placeholder: 'Enter class name',
      required: true,
      section: 'classInfo',
      sectionTitle: 'Class Information',
      validation: {
        minLength: {
          value: 2,
          message: 'Name must be at least 2 characters'
        }
      }
    },
    {
      name: 'batchId',
      label: 'Batch',
      type: 'select',
      placeholder: 'Select batch',
      required: true,
      section: 'classAssignments',
      sectionTitle: 'Assignments & Status',
      apiEndpoint: '/batches',
      valueField: 'batchId',
      labelField: 'batchName'
    },
    {
      name: 'staffIds',
      label: 'Staff',
      type: 'multiselect',
      placeholder: 'Select staff',
      required: true,
      section: 'classAssignments',
      apiEndpoint: '/staff',
      valueField: 'staffId',
      labelField: 'name'
    },
    {
      name: 'studentIds',
      label: 'Students',
      type: 'multiselect',
      placeholder: 'Select students',
      required: true,
      section: 'classAssignments',
      apiEndpoint: '/students',
      valueField: 'studentId',
      labelField: 'name'
    },
    {
      name: 'subjectIds',
      label: 'Subjects',
      type: 'multiselect',
      placeholder: 'Select subjects',
      required: true,
      section: 'classAssignments',
      apiEndpoint: '/subjects',
      valueField: 'subjectId',
      labelField: 'name'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      section: 'classAssignments',
      sectionTitle: 'Assignments & Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
};

// exam form configuration
// exam form configuration
export const examFormConfig = {
  title: 'Create New Exam',
  fields: [
    {
      name: 'courseId',
      label: 'Course',
      type: 'select',
      placeholder: 'Select course',
      section: 'examMapping',
      sectionTitle: 'Exam Mapping',
      apiEndpoint: '/courses',
      valueField: 'courseId',
      labelField: 'courseName'
    },
    {
      name: 'qpId',
      label: 'Question Paper',
      type: 'select',
      placeholder: 'Select question paper',
      required: true,
      section: 'examMapping',
      apiEndpoint: '/questionpapers',
      valueField: 'qpId',
      labelField: 'title'
    },
    {
      name: 'batchId',
      label: 'Batch',
      type: 'select',
      placeholder: 'Select batch',
      required: true,
      section: 'examMapping',
      apiEndpoint: '/batches',
      valueField: 'batchId',
      labelField: 'batchName'
    },
    {
      name: 'date',
      label: 'Exam Date',
      type: 'date',
      required: true,
      section: 'examSchedule',
      sectionTitle: 'Schedule & Status'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      section: 'examSchedule',
       options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
};
 
// result form configuration
export const resultFormConfig = {
  title: 'Create New Result',
  fields: [
    // Student & Exam Details
    {
      name: 'studentId',
      label: 'Student',
      type: 'select',
      placeholder: 'Select Student',
      required: true,
      section: 'studentExam',
      sectionTitle: 'Student & Exam Details',
      apiEndpoint: '/students',
      valueField: 'studentId',
      labelField: 'name'
    },
    {
      name: 'examId',
      label: 'Exam (Question Paper)',
      type: 'select',
      placeholder: 'Select Exam',
      required: true,
      section: 'studentExam',
      apiEndpoint: '/exams',
      valueField: 'examId',
      labelField: 'examWithQP'
    },

    // Marks & Performance
    {
      name: 'totalMarks',
      label: 'Total Marks (Auto-filled from Question Paper)',
      type: 'text',
      placeholder: 'Auto-filled',
      required: false,
      section: 'marks',
      sectionTitle: 'Marks & Performance',
      disabled: true
    },
    {
      name: 'obtainedMarks',
      label: 'Obtained Marks',
      type: 'text',
      placeholder: 'Enter Obtained Marks',
      required: true,
      section: 'marks',
      sectionTitle: 'Marks & Performance'
    },
    {
      name: 'percentage',
      label: 'Percentage (Auto-calculated)',
      type: 'text',
      placeholder: 'Auto Calculated',
      required: false,
      section: 'marks'
    },
    {
      name: 'grade',
      label: 'Grade (Auto-calculated)',
      type: 'text',
      placeholder: 'Auto Calculated',
      required: false,
      section: 'marks'
    },

    // Remarks & Status
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'text',
      placeholder: 'Enter Teacher Remarks',
      section: 'remarksStatus',
      sectionTitle: 'Remarks & Status'
    },
    {
      name: 'status',
      label: 'Result Status',
      type: 'select',
      placeholder: 'Select Status',
      required: true,
      section: 'remarksStatus',
      sectionTitle: 'Remarks & Status',
     options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
}

// // Student form Configration
// export const studentFormConfig = {
//   title: 'Create New Student',
//   fields: [
//     {
//       name: 'avatar',
//       label: 'Profile Photo',
//       type: 'avatar',
//       accept: 'image/*',
//       section: 'profile',
//       sectionTitle: 'Profile Photo'
//     },

//     {
//       name: 'name',
//       label: 'Full Name',
//       type: 'text',
//       placeholder: 'Enter full name',
//       required: true,
//       section: 'basic',
//       sectionTitle: 'Student Details',
//       validation: {
//         minLength: {
//           value: 2,
//           message: 'Name must be at least 2 characters'
//         }
//       }
//     },
//     {
//       name: 'dateofbirth',
//       label: 'Date Of Birth',
//       type: 'date',
//       required: true,
//       section: 'basic'
//     },
//     {
//       name: 'gender',
//       label: 'Gender',
//       type: 'select',
//       placeholder: 'Select gender',
//       required: true,
//       section: 'basic',
//       options: [
//         { value: 'female', label: 'Female' },
//         { value: 'male', label: 'Male' }
//       ]
//     },

//     {
//       name: 'phone',
//       label: 'Phone Number',
//       type: 'number',
//       placeholder: 'Enter phone number',
//       required: true,
//       section: 'basic'
//     },
//     {
//       name: 'email',
//       label: 'Email Address',
//       type: 'email',
//       placeholder: 'Enter email address',
//       required: true,
//       section: 'basic',
//       validation: {
//         pattern: {
//           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//           message: 'Invalid email address'
//         }
//       }
//     },
//     {
//       name: 'address',
//       label: 'Address',
//       type: 'textarea',
//       placeholder: 'Enter address',
//       required: true,
//       newline: true,
//       section: 'basic'
//     },
//     // Academic section
//     {
//       name: 'userId',
//       label: 'User ID',
//       type: 'text',
//       placeholder: 'Enter User ID',
//       section: 'academic',
//       sectionTitle: 'Academic Details'
//     },
//     {
//       name: 'batchId',
//       label: 'Batch',
//       type: 'select',
//       placeholder: 'Select Batch',
//       section: 'academic',
//       apiEndpoint: '/batches',
//       valueField: 'batchId',
//       labelField: 'batchName'
//     },
//     {
//       name: 'courseId',
//       label: 'Course',
//       type: 'select',
//       placeholder: 'Select Course',
//       section: 'academic',
//       apiEndpoint: '/courses',
//       valueField: 'courseId',
//       labelField: 'courseName'
//     },
//     {
//       name: 'rollNo',
//       label: 'Roll Number',
//       type: 'number',
//       placeholder: 'Enter roll no',
//       required: true,
//       section: 'academic'
//     },

//     // Status section
//     {
//       name: 'status',
//       label: 'Status',
//       type: 'select',
//       placeholder: 'Select status',
//       section: 'status',
//       sectionTitle: 'System Status',
//       options: [
//         { value: 'Active', label: 'Active' },
//         { value: 'Inactive', label: 'Inactive' },
//         { value: 'Pending', label: 'Pending' }
//       ]
//     }
//   ]
// };

// Student form Configration
export const studentFormConfig = {
  title: 'Create New Student',
  fields: [
    {
      name: 'profilePic',
      label: 'Profile Photo',
      type: 'avatar',
      accept: 'image/*',
      section: 'profile',
      sectionTitle: 'Profile Photo'
    },
  {
      name: 'userId',
      label: 'User ID',
      type: 'select',
      placeholder: 'Select User ID',
     
      section: 'basic',
      sectionTitle: 'Student Details',
      apiEndpoint: '/users',
      valueField: 'userId',
      labelField: 'name',
      onChange: 'populateUserFields'
    },
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true,
      section: 'basic',
      // sectionTitle: 'Student Details',
       disabled: true,
      validation: {
        minLength: {
          value: 2,
          message: 'Name must be at least 2 characters'
        }
      }
    },
    {
      name: 'dob',
      label: 'Date Of Birth',
      type: 'date',
      required: true,
      section: 'basic'
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      placeholder: 'Select gender',
      required: true,
      section: 'basic',
      options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' }
      ]
    },
   
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'number',
      placeholder: 'Enter phone number',
      required: true,
      section: 'basic'
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      section: 'basic',
      disabled: true,
      validation: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      }
    },
{
      name: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter address',
      required: true,
      newline: true,
      section: 'basic'
    },
    // Academic section
   
    {
      name: 'batchId',
      label: 'Batch',
      type: 'select',
      placeholder: 'Select Batch',
      section: 'academic',
       sectionTitle: 'Academic Details',
      apiEndpoint: '/batches',
      valueField: 'batchId',
      labelField: 'batchName'
    },
    {
      name: 'courseId',
      label: 'Course',
      type: 'select',
      placeholder: 'Select Course',
      section: 'academic',
      apiEndpoint: '/courses',
      valueField: 'courseId',
      labelField: 'courseName'
    },
    {
      name: 'rollNo',
      label: 'Roll Number',
      type: 'number',
      placeholder: 'Enter roll no',
      required: true,
      section: 'academic'
    },
    {
      name: 'specialFees',
      label: 'Special Fees (Optional)',
      type: 'number',
      placeholder: 'Enter special fees amount',
      section: 'academic'
    },
 
    // Status section
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      section: 'status',
      sectionTitle: 'System Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
};
 
 
// Batch form Configration

export const batchFormConfig = {
  title: 'Create New Batch',
  fields: [
    {
      name: 'batchName',
      label: 'Batch Name',
      type: 'text',
      placeholder: 'Enter Batch Name',
      required: true,
      fullWidth: true,
      section: 'basic',
      sectionTitle: 'Batch Details',
      validation: {
        minLength: {
          value: 3,
          message: 'Batch Name must be at least 3 characters'
        }
      }
    },

    // Academic Section
    {
      name: 'courseId',
      label: 'Course',
      type: 'select',
      placeholder: 'Select Course',
      section: 'academic',
      sectionTitle: 'Academic Assignment',
      apiEndpoint: '/courses',
      valueField: 'courseId',
      labelField: 'courseName'
    },
    {
      name: 'staffIds',
      label: 'Staff',
      type: 'multiselect',
      placeholder: 'Select Staff',
      section: 'academic',
      apiEndpoint: '/staff',
      valueField: 'staffId',
      labelField: 'name'
    },
    {
      name: 'studentIds',
      label: 'Students',
      type: 'multiselect',
      placeholder: 'Select Students',
      section: 'academic',
      apiEndpoint: '/students',
      valueField: 'studentId',
      labelField: 'name'
    },

    // Schedule Section
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
      section: 'schedule',
      sectionTitle: 'Batch Schedule'
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
      section: 'schedule'
    },

    // Status Section
 
     {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      section: 'status',
      sectionTitle: 'System Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
};


// Attendance form Configration

export const attendanceFormConfig = {
  title: 'Create New Attendance',
  fields: [
    // Mapping Section
    {
      name: 'batchId',
      label: 'Batch',
      type: 'select',
      placeholder: 'Select Batch',
      section: 'mapping',
      sectionTitle: 'Class & Subject Mapping',
      required: true,
      apiEndpoint: '/batches',
      valueField: 'batchId',
      labelField: 'batchName'
    },
    {
      name: 'subjectId',
      label: 'Subject',
      type: 'select',
      placeholder: 'Select Subject',
      section: 'mapping',
      required: true,
      apiEndpoint: '/subjects',
      valueField: 'subjectId',
      labelField: 'name'
    },

    // Attendance Details Section
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      section: 'basic',
      sectionTitle: 'Attendance Details',
      required: true
    },

    // Dynamic Records Section: Student + Status
    {
      name: 'records',
      label: 'Student Attendance',
      type: 'array', // repeatable field
      section: 'records',
      sectionTitle: 'Student Attendance Records',
      addButtonText: 'Add Attendance',
      itemLabel: 'Attendance',
      fields: [
        {
          name: 'studentId',
          label: 'Student',
          type: 'select',
          placeholder: 'Select Student',
          apiEndpoint: '/students',
          valueField: 'studentId',
          labelField: 'name'
        },
        {
          name: 'attendanceStatus',
          label: 'Attendance Status',
          type: 'select',
          options: [
            { value: 'Present', label: 'Present' },
            { value: 'Absent', label: 'Absent' },
            { value: 'Late', label: 'Late' }
          ]
        },

      ]
    },
    // Status Section
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      section: 'status',
      sectionTitle: 'System Status',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Pending', label: 'Pending' }
      ]
    }
  ]
};


// staff form configuration
export const staffFormConfig = {
  title: 'Staff Management',
  fields: [
    // Profile Photo Section
    {
      name: 'profilePic',
      label: 'Profile Photo',
      type: 'avatar',
      accept: 'image/*',
      section: 'profile',
      sectionTitle: 'Profile Photo'
    },

    // Basic Information Section
     {
      name: 'userId',
      label: 'User',
      type: 'select',
      placeholder: 'Select user',
      required: true,
        section: 'basic',
      sectionTitle: 'Basic Information',
      apiEndpoint: '/users?role=staff',
      valueField: 'userId',
      labelField: 'name',
      onChange: 'populateUserFields'
    },
    {
      name: 'name',
      label: 'Staff Name',
      type: 'text',
      placeholder: 'Enter staff name',
      required: true,
      section: 'basic',
      // sectionTitle: 'Basic Information',
       disabled: true
    },

    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
       disabled: true,
      section: 'basic',
      validation: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      }
    },

    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      placeholder: 'Enter phone number',
      required: true,
      section: 'basic',
      validation: {
        pattern: {
          value: /^[0-9]{10}$/,
          message: 'Phone number must be 10 digits'
        }
      }
    },
    // {
    //   name: 'address',
    //   label: 'Address',
    //   type: 'textarea',
    //   placeholder: 'Enter complete address',
    //   required: true,
    //   newline: true,
    //   section: 'basic'
    // },

    // Professional Details Section
    {
      name: 'qualification',
      label: 'Qualification',
      type: 'text',
      placeholder: 'e.g., M.Sc., B.Ed.',
      required: true,
      section: 'professional',
      sectionTitle: 'Professional Details'
    },
    {
      name: 'experience',
      label: 'Years of Experience',
      type: 'text',
      placeholder: 'e.g., 5 years',
      required: true,
      section: 'professional'
    },
    {
      name: 'subjectExpertise',
      label: 'Subject Expertise',
      type: 'select',
      placeholder: 'Select subject',
      required: true,
      section: 'professional',
      apiEndpoint: '/subjects',
      valueField: 'subjectId',
      labelField: 'name'
    },

    // Assignment Section
   
    // {
    //   name: 'name',
    //   label: 'Name',
    //   type: 'text',
    //   placeholder: 'Name will be auto-filled',
    //   section: 'assignment',
    //   disabled: true
    // },
    // {
    //   name: 'email',
    //   label: 'Email',
    //   type: 'email',
    //   placeholder: 'Email will be auto-filled',
    //   section: 'assignment',
    //   disabled: true
    // },


    //  {
    //   name: 'staffId',
    //   label: 'Assigned Staff',
    //   type: 'select',
    //   placeholder: 'Select staff',
    //   required: true,
    //   section: 'subjectManagement',
    //   sectionTitle: 'Staff Assignment & Status',
    //   apiEndpoint: '/staff',
    //   valueField: 'staffId',
    //   labelField: 'name'
    // },
    // {
    //   name: 'batchId',
    //   label: 'Assigned Batch',
    //   type: 'select',
    //   placeholder: 'Select batch',
    //   required: true,
    //   section: 'assignment',
    //   apiEndpoint: '/batches',
    //   valueField: 'batchId',
    //   labelField: 'batchName'
    // },

    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      section: 'assignment',
 sectionTitle: 'Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
}

// timetable form configuration
export const timetableFormConfig = {
  title: 'TimeTable Management',
  fields: [
    // Batch & Week Section
    {
      name: 'batchId',
      label: 'Batch',
      type: 'select',
      placeholder: 'Select Batch',
      required: true,
      section: 'batchInfo',
      sectionTitle: 'Batch & Week Details',
      apiEndpoint: '/batches',
      valueField: 'batchId',
      labelField: 'batchName'
    },
    {
      name: 'weekStartDate',
      label: 'Week Start Date',
      type: 'date',
      required: true,
      section: 'batchInfo'
    },

    // Weekly Schedule (Dynamic)
    {
      name: 'schedule',
      label: 'Weekly Class Schedule',
      type: 'array',     // ✅ repeatable form rows
      section: 'classSchedule',
      sectionTitle: 'Class Schedule',
      addButtonText: 'Add Timetable',
      itemLabel: 'Timetable',
      fields: [
        {
          name: 'day',
          label: 'Day',
          type: 'select',
          required: true,
          options: [
            { value: 'Monday', label: 'Monday' },
            { value: 'Tuesday', label: 'Tuesday' },
            { value: 'Wednesday', label: 'Wednesday' },
            { value: 'Thursday', label: 'Thursday' },
            { value: 'Friday', label: 'Friday' },
            { value: 'Saturday', label: 'Saturday' },
            { value: 'Sunday', label: 'Sunday' }
          ]
        },
        {
          name: 'subjectId',
          label: 'Subject',
          type: 'select',
          placeholder: 'Select Subject',
          required: true,
          apiEndpoint: '/subjects',
          valueField: 'subjectId',
          labelField: 'name'
        },
        {
          name: 'startTime',
          label: 'Start Time',
          type: 'time',
          required: true
        },
        {
          name: 'endTime',
          label: 'End Time',
          type: 'time',
          required: true
        },
        {
          name: 'staffId',
          label: 'Staff',
          type: 'select',
          placeholder: 'Select Staff',
          required: true,
          apiEndpoint: '/staff',
          valueField: 'staffId',
          labelField: 'name'
        },
        {
          name: 'roomNo',
          label: 'Room Number',
          type: 'text',
          required: true
        }
      ]
    },

    // Status Section
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select Status',
      section: 'statusSection',
      sectionTitle: 'Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
};

// study material form configuration
export const studymaterialFormConfig = {
  title: 'Study Material Management',
  fields: [
    // Basic Info
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      section: 'basicInfo',
      sectionTitle: 'Basic Information'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
      section: 'basicInfo'
    },

    // Subject Details
    {
      name: 'subjectId',
      label: 'Subject',
      type: 'select',
      placeholder: 'Select Subject',
      required: true,
      section: 'subjectDetails',
      sectionTitle: 'Subject Details',
      apiEndpoint: '/subjects',
      valueField: 'subjectId',
      labelField: 'name'
    },

    // File Upload Field
    {
      name: 'file',
      label: 'Upload File',
      type: 'files',
      required: false, // Not required for edit mode
      section: 'uploadSection',
      sectionTitle: 'Upload Study Material',
      accept: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'png'],
      showExistingFile: true // Show existing file info in edit mode
    },

    // Status Section
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select Status',
      section: 'statusSection',
      sectionTitle: 'Status',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
}

// questionpaper form configuration
export const questionPaperFormConfig = {
  title: 'Question Paper Management',
  fields: [
    // Basic Info
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      section: 'basicInfo',
      sectionTitle: 'Basic Information'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
      section: 'basicInfo'
    },

    // Subject & Batch Section
    {
      name: 'courseId',
      label: 'Course',
      type: 'select',
      placeholder: 'Select Course',
      section: 'subjectBatch',
      sectionTitle: 'Course,Subject & Batch Details',
      apiEndpoint: '/courses',
      valueField: 'courseId',
      labelField: 'courseName'
    },
    {
      name: 'subjectId',
      label: 'Subject',
      type: 'select',
      placeholder: 'Select Subject',
      required: true,
      section: 'subjectBatch',
      apiEndpoint: '/subjects',
      valueField: 'subjectId',
      labelField: 'name'
    },
    {
      name: 'batchId',
      label: 'Batch',
      type: 'select',
      placeholder: 'Select Batch',
      required: true,
      section: 'subjectBatch',
      apiEndpoint: '/batches',
      valueField: 'batchId',
      labelField: 'batchName'
    },

    // Exam Info
    {
      name: 'examDate',
      label: 'Exam Date',
      type: 'date',
      required: true,
      section: 'examInfo',
      sectionTitle: 'Exam Information (NEET Pattern)'
    },
    {
      name: 'startTime',
      label: 'Exam Start Time',
      type: 'time',
      required: true,
      section: 'examInfo',
      placeholder: 'Select start time'
    },
    {
      name: 'totalMarks',
      label: 'Total Marks',
      type: 'number',
      required: true,
      section: 'examInfo',
      placeholder: 'Enter total marks'
    },
    {
      name: 'duration',
      label: 'Duration (in minutes)',
      type: 'number',
      required: true,
      section: 'examInfo',
      placeholder: 'Enter duration in minutes'
    },
    {
      name: 'marksPerCorrect',
      label: 'Marks Per Correct Answer',
      type: 'number',
      required: true,
      section: 'examInfo',
      placeholder: 'Enter marks for correct answer'
    },
    {
      name: 'marksPerIncorrect',
      label: 'Marks Per Incorrect Answer (Negative)',
      type: 'number',
      required: true,
      section: 'examInfo',
      placeholder: 'Enter negative marks (e.g., -1)'
    },

    // File Upload
    {
      name: 'file',
      label: 'Upload Question Paper',
      type: 'files',
      required: false,
      section: 'uploadSection',
      sectionTitle: 'Upload File OR Create Question Set (Choose One)',
      accept: ['pdf', 'doc', 'docx'],
      conditionalRequired: 'questionSet'
    },

    // Dynamic Question Set
    {
      name: 'questionSet',
      label: 'Questions',
      type: 'array', // dynamic repeatable section
      section: 'questionSection',
      sectionTitle: 'Question Set',
      addButtonText: 'Add Question',
      itemLabel: 'Question',
      conditionalRequired: 'file',
      fields: [
        {
          name: 'questionText',
          label: 'Question Text',
          type: 'text',
          required: true
        },
        {
          name: 'questionImage',
          label: 'Question Image (Optional)',
          type: 'image',
          accept: 'image/*',
          required: false
        },
        {
          name: 'options',
          label: 'Options',
          type: 'arrayText', // array of text fields
          required: true
        },
        {
          name: 'correctAnswer',
          label: 'Correct Answer (A/B/C/D)',
          type: 'select',
          required: true,
          options: [
            { value: 'A', label: 'A' },
            { value: 'B', label: 'B' },
            { value: 'C', label: 'C' },
            { value: 'D', label: 'D' }
          ]
        }
      ]
    },

    // Status Section
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select Status',
      section: 'statusSection',
      sectionTitle: 'Status',
        options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ]
}


// Common Attendance form Configuration
export const commonAttendanceFormConfig = {
  title: 'Create Common Attendance',
  fields: [
    {
      name: 'batchId',
      label: 'Batch',
      type: 'select',
      placeholder: 'Select Batch',
      section: 'mapping',
      sectionTitle: 'Batch & Date Details',
      required: true,
      apiEndpoint: '/batches',
      valueField: 'batchId',
      labelField: 'batchName'
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      section: 'mapping',
      required: true
    },
    {
      name: 'records',
      label: 'Student Attendance',
      type: 'array',
      section: 'records',
      sectionTitle: 'Student Attendance Records',
      addButtonText: 'Add Attendance',
      itemLabel: 'Attendance',
      fields: [
        {
          name: 'studentId',
          label: 'Student',
          type: 'select',
          placeholder: 'Select Student',
          apiEndpoint: '/students',
          valueField: 'studentId',
          labelField: 'name'
        },
        {
          name: 'attendanceStatus',
          label: 'Attendance Status',
          type: 'select',
          options: [
            { value: 'Present', label: 'Present' },
            { value: 'Absent', label: 'Absent' },
            { value: 'Late', label: 'Late' }
          ]
        }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      section: 'status',
      sectionTitle: 'System Status',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ]
    }
  ]
}
