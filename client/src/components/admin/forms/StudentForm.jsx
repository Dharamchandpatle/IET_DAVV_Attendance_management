import { motion } from 'framer-motion';
import { DEPARTMENTS, SEMESTERS } from '../adminConstants';

export function StudentForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(Object.fromEntries(formData));
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

        <select name="semester" className="form-input" required>
          <option value="">Select Semester</option>
          {SEMESTERS.map((semester) => (
            <option key={semester.value} value={semester.value}>
              {semester.label}
            </option>
          ))}
        </select>
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        className="form-input"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="form-input"
          required
        />
        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number (Auto-generated)"
          className="form-input"
          disabled
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2 bg-blue-600 text-white rounded-lg"
      >
        Add Student
      </motion.button>
    </form>
  );
}
