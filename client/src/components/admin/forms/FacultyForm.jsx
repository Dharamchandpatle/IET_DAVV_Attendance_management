// import { motion } from 'framer-motion';
import { useState } from 'react';
import { DEPARTMENTS, DESIGNATIONS } from '../adminConstants';

// Form component for creating or editing faculty records.
export function FacultyForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    facultyId: generateFacultyId(),
    department: '',
    designation: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    onSubmit({
      ...Object.fromEntries(data),
      facultyId: formData.facultyId
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="form-input"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="form-input"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select name="department" className="form-input" required>
          <option value="">Select Department</option>
          {DEPARTMENTS.map((department) => (
            <option key={department.value} value={department.value}>
              {department.label}
            </option>
          ))}
        </select>

        <select name="designation" className="form-input" required>
          <option value="">Select Designation</option>
          {DESIGNATIONS.map((designation) => (
            <option key={designation.value} value={designation.value}>
              {designation.label}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={formData.facultyId}
        className="form-input"
        disabled
      />

      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Faculty Member</button>
    </form>
  );
}

function generateFacultyId() {
  // Generates a unique faculty ID using prefix and random number.
  const prefix = 'FAC';
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${random}`;
}
