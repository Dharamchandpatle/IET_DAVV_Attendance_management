import { motion } from 'framer-motion';
import { useState } from 'react';

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
          <option value="CSE">Computer Science</option>
          <option value="IT">Information Technology</option>
        </select>

        <select name="designation" className="form-input" required>
          <option value="">Select Designation</option>
          <option value="Professor">Professor</option>
          <option value="Associate Professor">Associate Professor</option>
          <option value="Assistant Professor">Assistant Professor</option>
        </select>
      </div>

      <input
        type="text"
        value={formData.facultyId}
        className="form-input"
        disabled
      />

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2 bg-blue-600 text-white rounded-lg"
      >
        Add Faculty Member
      </motion.button>
    </form>
  );
}

function generateFacultyId() {
  const prefix = 'FAC';
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${random}`;
}
