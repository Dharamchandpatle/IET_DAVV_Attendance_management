// import { motion } from 'framer-motion';
import { Camera, Edit2, Mail, Phone, School, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AttendanceHistory } from '../components/student/AttendanceHistory';
import { useAuth } from '../context/AuthContext';

export function StudentProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Fetch student profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          // Use the user data from auth context as the profile
          const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            roll_number: user.roll_number,
            department_name: user.department_name || 'Computer Science',
            semester: user.semester || 4,
            section: user.section || 'A',
            admission_year: user.admission_year,
            cgpa: user.cgpa || 0,
            profile_image: user.profile_image,
            guardian_name: user.guardian_name || '',
            guardian_phone: user.guardian_phone || '',
            attendance: 85,
            totalClasses: 100,
            attendedClasses: 85,
            attendanceHistory: [true, true, false, true, true]
          };
          setProfileData(data);
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
          setProfileData(prev => ({
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
      const updateData = {
        name: formData.get('name') || profileData.name,
        phone: formData.get('phone'),
        address: formData.get('address')
      };

      // Update profile data locally
      setProfileData(prev => ({
        ...prev,
        ...updateData
      }));

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !profileData) {
    return (
      <DashboardLayout userRole="student">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const info = profileData;

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div 
          className="profile-section relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={profileData.profileImage} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
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
              <h1 className="text-3xl font-bold">{info.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <School className="w-4 h-4" />
                {info.department} • {info.semester} Semester
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600"
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
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <input
                  type="tel"
                  name="phone"
                  defaultValue={info.phone}
                  className="form-input"
                  placeholder="Phone Number"
                  required
                  pattern="[0-9+\s]{10,}"
                />
                <input
                  type="text"
                  name="address"
                  defaultValue={info.address}
                  className="form-input"
                  placeholder="Address"
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
                  <User className="w-5 h-5 text-gray-400" />
                  <span>ID: {info.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{info.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{info.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Academic Performance */}
          <div 
            className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Overall Attendance ({profileData.academicInfo.attendedClasses}/{profileData.academicInfo.totalClasses} classes)
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(profileData.attendedClasses / profileData.totalClasses) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold">{Math.round((profileData.attendedClasses / profileData.totalClasses) * 100)}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">CGPA</p>
                <p 
                  className="text-2xl font-bold"
                >
                  {profileData.cgpa}
                </p>
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div 
            className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm md:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
            <AttendanceHistory history={profileData.attendanceHistory} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
