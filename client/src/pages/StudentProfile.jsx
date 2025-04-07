import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Camera, Edit2, Mail, Phone, School, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AttendanceHistory } from '../components/student/AttendanceHistory';
import { useToast } from '../components/ui/toast';
import { useAuth } from '../context/AuthContext';

export function StudentProfile() {
  const { user } = useAuth();
  const { show } = useToast();
  const containerRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    profileImage: '/default-avatar.png',
    personalInfo: {
      name: '',
      id: '',
      email: '',
      phone: '',
      address: '',
      department: '',
      semester: '',
      section: ''
    },
    academicInfo: {
      attendance: 0,
      cgpa: 0,
      totalClasses: 0,
      attendedClasses: 0
    },
    attendanceHistory: []
  });

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        // API call would go here
        // For now using mock data
        const mockData = {
          profileImage: '/default-avatar.png',
          personalInfo: {
            name: 'Dharamchand Patle',
            id: 'DE24799',
            email: '24bcs091@ietdavv.edu.in',
            phone: '+91 6263827162',
            address: '123 College Road, Indore',
            department: 'Computer Science',
            semester: '4th',
            section: 'A'
          },
          academicInfo: {
            attendance: 85,
            cgpa: 8.5,
            totalClasses: 100,
            attendedClasses: 85
          },
          attendanceHistory: [true, true, false, true, true]
        };

        setProfileData(mockData);
        gsap.from('.profile-section', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        });
      } catch (error) {
        show({
          title: "Error",
          description: "Failed to load profile data",
          type: "error"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [show]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // API call would go here for image upload
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileData(prev => ({
            ...prev,
            profileImage: e.target.result
          }));
        };
        reader.readAsDataURL(file);
        
        show({
          title: "Success",
          description: "Profile picture updated successfully",
          type: "success"
        });
      } catch (error) {
        show({
          title: "Error",
          description: "Failed to update profile picture",
          type: "error"
        });
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      // API call would go here
      const updatedInfo = {
        phone: formData.get('phone'),
        address: formData.get('address')
      };

      setProfileData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...updatedInfo
        }
      }));

      setIsEditing(false);
      show({
        title: "Success",
        description: "Profile updated successfully",
        type: "success"
      });
    } catch (error) {
      show({
        title: "Error",
        description: "Failed to update profile",
        type: "error"
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="student">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-4xl mx-auto space-y-8" ref={containerRef}>
        {/* Profile Header */}
        <motion.div 
          className="profile-section relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              <h1 className="text-3xl font-bold">{profileData.personalInfo.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <School className="w-4 h-4" />
                {profileData.personalInfo.department} • {profileData.personalInfo.semester} Semester
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600"
            >
              <Edit2 className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div 
            className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <input
                  type="tel"
                  name="phone"
                  defaultValue={profileData.personalInfo.phone}
                  className="form-input"
                  placeholder="Phone Number"
                  required
                  pattern="[0-9+\s]{10,}"
                />
                <input
                  type="text"
                  name="address"
                  defaultValue={profileData.personalInfo.address}
                  className="form-input"
                  placeholder="Address"
                  required
                />
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>ID: {profileData.personalInfo.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{profileData.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{profileData.personalInfo.phone}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Academic Performance */}
          <motion.div 
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
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileData.academicInfo.attendance}%` }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <span className="font-bold">{profileData.academicInfo.attendance}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">CGPA</p>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold"
                >
                  {profileData.academicInfo.cgpa}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Attendance History */}
          <motion.div 
            className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm md:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
            <AttendanceHistory history={profileData.attendanceHistory} />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
