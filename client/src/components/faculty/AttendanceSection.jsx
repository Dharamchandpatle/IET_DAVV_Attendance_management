// import { motion } from 'framer-motion';

import {
  Calendar,
  Check,
  Search,
  X
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  useNavigate
} from 'react-router-dom';

import {
  getApiErrorMessage
} from '../../services/api';

import {
  markClassAttendance
} from '../../services/attendanceService';

import {
  listStudents
} from '../../services/studentService';

import {
  AttendanceStats
} from '../attendance/AttendanceStats';

import {
  useToast
} from '../ui/toast';


// ============================================
// FACULTY ATTENDANCE SECTION
// ============================================

export function AttendanceSection() {

  // ============================================
  // STATES
  // ============================================

  const [students, setStudents] = useState([]);

  // Separate attendance state
  const [attendanceMap, setAttendanceMap] =
    useState({});

  const [search, setSearch] =
    useState('');

  const [attendanceType, setAttendanceType] =
    useState('regular');

  const [selectedBranch, setSelectedBranch] =
    useState('all');

  const [selectedSemester, setSelectedSemester] =
    useState('all');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const selectedDate = useMemo(
    () => new Date(),
    []
  );

  const [academicYear, setAcademicYear] =
    useState(() => {

      const now = new Date();

      const year = now.getFullYear();

      return `${year}-${year + 1}`;
    });

  const navigate = useNavigate();

  const { show } = useToast();


  // ============================================
  // LOAD STUDENTS
  // ============================================

  useEffect(() => {

    let isMounted = true;

    const loadStudents = async () => {

      try {

        const data = await listStudents();

        if (!isMounted) return;

        const mappedStudents = data.map(
          (student, index) => {

            const id =
              student.user_id ??
              student.id ??
              index + 1;

            return {

              id: String(id),

              userId: String(id),

              name:
                student.name ||
                `${student.first_name || ''} ${student.last_name || ''}`.trim() ||
                'Unknown',

              roll:
                student.roll_number ||
                student.roll ||
                '',

              branch:
                student.department_code ||
                student.department_name ||
                'Unknown',

              semester: Number(
                student.semester ??
                student.sem ??
                1
              ),

              attendance: {
                regular: 0,
                events: 0,
                overall: 0
              }
            };
          }
        );

        setStudents(mappedStudents);

      } catch (error) {

        show({
          title: 'Unable to load students',
          description: getApiErrorMessage(
            error,
            'Please try again later.'
          ),
          type: 'error'
        });
      }
    };

    loadStudents();

    return () => {
      isMounted = false;
    };

  }, [show]);


  // ============================================
  // FILTER STUDENTS
  // ============================================

  const query =
    search.trim().toLowerCase();

  const filteredStudents = students.filter(
    (student) => {

      const matchesSearch =
        !query ||

        student.name
          ?.toLowerCase()
          .includes(query) ||

        student.roll
          ?.toLowerCase()
          .includes(query) ||

        student.branch
          ?.toLowerCase()
          .includes(query);

      const matchesBranch =
        selectedBranch === 'all' ||

        student.branch === selectedBranch;

      const matchesSemester =
        selectedSemester === 'all' ||

        Number(student.semester) ===
        Number(selectedSemester);

      return (
        matchesSearch &&
        matchesBranch &&
        matchesSemester
      );
    }
  );


  // ============================================
  // ATTENDANCE SUMMARY
  // ============================================

  // Present Count
  const presentCount = filteredStudents.reduce(
    (count, student) => {

      const sid = String(student.id);

      return attendanceMap[sid] === 'present'
        ? count + 1
        : count;

    },
    0
  );


  // Absent Count
  const absentCount = filteredStudents.reduce(
    (count, student) => {

      const sid = String(student.id);

      return attendanceMap[sid] === 'absent'
        ? count + 1
        : count;

    },
    0
  );


  // Total Students
  const totalStudents = filteredStudents.length;


  // Total Marked
  const totalMarked =
    presentCount + absentCount;


  // Attendance Percentage
  const attendancePercentage =
    totalStudents > 0
      ? Math.round(
        (presentCount / totalStudents) * 100
      )
      : 0;
  // ============================================
  // MARK SINGLE STUDENT
  // ============================================

  const handleMarkAttendance = (
    studentId,
    status
  ) => {
    const sid = String(studentId);

    setAttendanceMap((prev) => ({

      ...prev,

      [sid]: status

    }));
  };


  // ============================================
  // MARK ALL
  // ============================================

  const handleBatchMark = (status) => {

    const updatedAttendance = {};

    filteredStudents.forEach(student => {

      const sid = String(
        student.id
      );

      updatedAttendance[sid] = status;
    });

    setAttendanceMap((prev) => ({
      ...prev,
      ...updatedAttendance
    }));
  };


  // ============================================
  // SUBMIT ATTENDANCE
  // ============================================

  const handleSubmitAttendance = async () => {

    if (isSubmitting) return;

    try {

      setIsSubmitting(true);

      const classDate =
        selectedDate
          .toISOString()
          .split('T')[0];

      const records = filteredStudents.map(
        (student) => {

          const sid =
            String(student.id);

          return {

            user_id: Number(sid),

            status:
              attendanceMap[sid] ||
              'absent'
          };
        }
      );

      await markClassAttendance({

        class_date: classDate,

        records,

        attendance_type:
          attendanceType,

        semester:
          selectedSemester === 'all'
            ? null
            : Number(selectedSemester),

        academic_year:
          academicYear
      });

      show({
        title: 'Success',
        description:
          'Attendance submitted successfully',
        type: 'success'
      });

      navigate('/faculty');

    } catch (error) {

      show({
        title: 'Failed to submit',
        description: getApiErrorMessage(
          error,
          'Please try again.'
        ),
        type: 'error'
      });

    } finally {

      setIsSubmitting(false);
    }
  };


  // ============================================
  // UI
  // ============================================

  return (

    <div className="space-y-6">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>

          <h2 className="text-2xl font-semibold">
            Mark Attendance
          </h2>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">

            <Calendar className="w-5 h-5" />

            <span>
              {selectedDate.toLocaleDateString(
                'en-US',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }
              )}
            </span>

          </div>
        </div>

        <AttendanceStats
          present={presentCount}
          absent={absentCount}
          total={totalStudents}
          percentage={attendancePercentage}
        />

      </header>


      {/* ===================================== */}
      {/* FILTERS */}
      {/* ===================================== */}

      <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">

        {/* SEARCH */}

        <div className="flex-1 relative min-w-[220px]">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

        </div>


        {/* ATTENDANCE TYPE */}

        <select
          value={attendanceType}
          onChange={(e) =>
            setAttendanceType(
              e.target.value
            )
          }
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >

          <option value="regular">
            Regular Class
          </option>

          <option value="college_event">
            College Event
          </option>

          <option value="govt_event">
            Government Event
          </option>

          <option value="other">
            Other
          </option>

        </select>


        {/* BRANCH */}

        <select
          value={selectedBranch}
          onChange={(e) =>
            setSelectedBranch(
              e.target.value
            )
          }
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >

          <option value="all">
            All Branches
          </option>

          <option value="CE">
            CE
          </option>

          <option value="IT">
            IT
          </option>

          <option value="ME">
            ME
          </option>

        </select>


        {/* SEMESTER */}

        <select
          value={selectedSemester}
          onChange={(e) =>
            setSelectedSemester(
              e.target.value
            )
          }
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >

          <option value="all">
            All Semesters
          </option>

          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (

            <option
              key={sem}
              value={sem}
            >
              Sem {sem}
            </option>

          ))}

        </select>


        {/* ACADEMIC YEAR */}

        <input
          type="text"
          value={academicYear}
          onChange={(e) =>
            setAcademicYear(
              e.target.value
            )
          }
          placeholder="Academic Year"
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />


        {/* BATCH ACTIONS */}

        <div className="flex gap-2">

          <button
            onClick={() =>
              handleBatchMark('present')
            }
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >

            <Check className="w-4 h-4" />

            Mark All Present

          </button>

          <button
            onClick={() =>
              handleBatchMark('absent')
            }
            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >

            <X className="w-4 h-4" />

            Mark All Absent

          </button>

        </div>

      </div>


      {/* ===================================== */}
      {/* STUDENTS LIST */}
      {/* ===================================== */}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">

        <div className="p-6 space-y-4">

          {filteredStudents.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No students found
            </div>

          ) : (

            filteredStudents.map(student => {

              const status =
                attendanceMap[
                String(student.id)
                ];

              return (

                <div
                  key={student.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                >

                  {/* STUDENT INFO */}

                  <div className="space-y-1">

                    <h3 className="font-medium">
                      {student.name}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">

                      <span>
                        Roll:
                        {' '}
                        {student.roll}
                      </span>

                      <span>
                        Branch:
                        {' '}
                        {student.branch}
                      </span>

                      <span>
                        Semester:
                        {' '}
                        {student.semester}
                      </span>

                    </div>

                  </div>


                  {/* ATTENDANCE BUTTONS */}

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        handleMarkAttendance(
                          student.id,
                          'present'
                        )
                      }
                      className={`px-5 py-2 rounded-lg transition-all duration-200 ${status === 'present'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    >
                      Present
                    </button>

                    <button
                      onClick={() =>
                        handleMarkAttendance(
                          student.id,
                          'absent'
                        )
                      }
                      className={`px-5 py-2 rounded-lg transition-all duration-200 ${status === 'absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    >
                      Absent
                    </button>

                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>


      {/* ===================================== */}
      {/* SUBMIT BUTTON */}
      {/* ===================================== */}

      <div className="flex justify-end">

        <button
          onClick={handleSubmitAttendance}
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-60 hover:bg-blue-700 transition-colors"
        >

          <Check className="w-4 h-4" />

          {isSubmitting
            ? 'Submitting...'
            : 'Submit Attendance'}

        </button>

      </div>

    </div>
  );
}