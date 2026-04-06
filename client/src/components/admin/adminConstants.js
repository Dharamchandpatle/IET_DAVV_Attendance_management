export const DEPARTMENTS = [
  { value: 'CSE', label: 'Computer Science' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'ECE', label: 'Electronics & Communication' }
];

export const DESIGNATIONS = [
  { value: 'Professor', label: 'Professor' },
  { value: 'Associate Professor', label: 'Associate Professor' },
  { value: 'Assistant Professor', label: 'Assistant Professor' }
];

export const SEMESTERS = Array.from({ length: 8 }, (_, index) => ({
  value: index + 1,
  label: `Semester ${index + 1}`
}));

export const TABLE_COLUMNS = {
  students: [
    { key: 'name', label: 'Name' },
    { key: 'rollNo', label: 'Roll No.' },
    { key: 'department', label: 'Department' },
    { key: 'semester', label: 'Semester' },
    { key: 'email', label: 'Email' },
    { key: 'attendance', label: 'Attendance' }
  ],
  faculty: [
    { key: 'name', label: 'Name' },
    { key: 'facultyId', label: 'Faculty ID' },
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'email', label: 'Email' },
    { key: 'courses', label: 'Courses' }
  ]
};

export const FORM_FIELDS = {
  'add-student': [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'select', required: true, options: DEPARTMENTS },
    { name: 'semester', label: 'Semester', type: 'select', required: true, options: SEMESTERS },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'address', label: 'Address', type: 'text', required: true }
  ],
  'add-faculty': [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'select', required: true, options: DEPARTMENTS },
    { name: 'designation', label: 'Designation', type: 'select', required: true, options: DESIGNATIONS },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'specialization', label: 'Specialization', type: 'text', required: true }
  ]
};

export const FORM_META = {
  'add-student': {
    title: 'Add New Student',
    submitLabel: 'Add Student'
  },
  'add-faculty': {
    title: 'Add New Faculty',
    submitLabel: 'Add Faculty'
  }
};
