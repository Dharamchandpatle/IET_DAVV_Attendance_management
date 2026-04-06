import { motion } from 'framer-motion';
import { DEPARTMENTS, SEMESTERS } from '../adminConstants';

export function CourseForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(Object.fromEntries(new FormData(e.target)));
    }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="courseCode"
          placeholder="Course Code"
          pattern="[A-Z]{2,4}[0-9]{3}"
          title="Example: CS101"
          className="form-input"
          required
        />
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
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

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="credits"
          placeholder="Credits"
          min="1"
          max="5"
          className="form-input"
          required
        />
        <select name="type" className="form-input" required>
          <option value="">Select Course Type</option>
          <option value="core">Core</option>
          <option value="elective">Elective</option>
        </select>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2 bg-blue-600 text-white rounded-lg"
      >
        Add Course
      </motion.button>
    </form>
  );
}
