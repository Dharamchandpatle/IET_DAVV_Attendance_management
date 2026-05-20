// import { motion } from 'framer-motion';
import { Book, Camera, Edit2, GraduationCap, Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export function FacultyProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [facultyData, setFacultyData] = useState(null);

  // Fetch faculty profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          // Use user data from auth context
          const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            faculty_code: user.faculty_code,
            department_name: user.department_name || 'Computer Science & Engineering',
            designation: user.designation || 'Assistant Professor',
            joining_date: user.joining_date,
            specialization: user.specialization || '',
            profile_image: user.profile_image,
            courses: [
              { id: 'CS101', name: 'Introduction to Programming', students: 60 },
              { id: 'CS204', name: 'Data Structures', students: 55 },
              { id: 'CS301', name: 'Database Management System', students: 96 },
              { id: 'CS302', name: 'Operating Systems', students: 85 }
            ],
            attendance: {
              present: 42,
              total: 45,
              history: [true, true, false, true, true]
            }
          };
          setFacultyData(data);
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFacultyData(prev => ({
            ...prev,
            profile_image: event.target.result
          }));
        };
        reader.readAsDataURL(file);
        toast.success('Profile picture updated');
      } catch (error) {
        toast.error('Failed to update profile picture');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      setIsLoading(true);
      const updatedInfo = {
        phone: formData.get('phone'),
        address: formData.get('address')
      };

      setFacultyData(prev => ({
        ...prev,
        ...updatedInfo
      }));

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !facultyData) {
    return (
      <DashboardLayout userRole="faculty">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="faculty">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div 
          className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img 
                src={facultyData.profile_image || '/icon.svg'} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500 transition-all duration-300"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transform transition-all duration-300 hover:scale-110">
                <Camera className="w-4 h-4 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                {facultyData.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {facultyData.designation}
              </p>
              <p className="text-sm text-gray-500">
                Faculty Code: {facultyData.faculty_code}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div 
            className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Personal Information
            </h2>
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <input
                  type="tel"
                  name="phone"
                  defaultValue={facultyData.phone}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
                <input
                  type="text"
                  name="address"
                  defaultValue={facultyData.address}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{facultyData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{facultyData.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{facultyData.address || facultyData.department_name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Assigned Courses */}
          <div className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Assigned Courses</h2>
            <div className="space-y-3">
              {facultyData.courses.map((course, index) => (
                <div
                  key={`${course.id}-${index}`}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{course.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{course.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{course.students}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Attendance Record</h2>
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {facultyData.attendance.present}/{facultyData.attendance.total} Classes
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(facultyData.attendance.present / facultyData.attendance.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
