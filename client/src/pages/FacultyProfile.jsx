import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Book, Camera, Edit2, GraduationCap, Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useToast } from '../components/ui/toast';

export function FacultyProfile() {
  const { show } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef(null);

  const [facultyData, setFacultyData] = useState({
    profileImage: '/default-avatar.png',
    personalInfo: {
      name: 'Dr. Vaibhav Jain sir',
      id: 'FAC001',
      email: 'vjain@iet.davv.ac.in',
      phone: '+91 9876543210',
      address: 'Department of Computer Science',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      joiningDate: '2010-08-15'
    },
    courses: [
      { id: 'CS101', name: 'Introduction to Programming', students: 60 },
      { id: 'CS204', name: 'Data Structures', students: 55 },
      { id: 'CS204', name: 'Data Base Management System', students: 96 },
      { id: 'CS204', name: 'Data Structures', students: 85 },
    ],
    attendance: {
      present: 42,
      total: 45,
      history: [true, true, false, true, true]
    }
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.profile-section', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFacultyData(prev => ({
            ...prev,
            profileImage: e.target.result
          }));
        };
        reader.readAsDataURL(file);
        
        show({
          title: "Success",
          description: "Profile picture updated successfully"
        });
      } catch (error) {
        show({
          title: "Error",
          description: "Failed to update profile picture"
        });
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const updatedInfo = {
        phone: formData.get('phone'),
        address: formData.get('address')
      };

      setFacultyData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...updatedInfo
        }
      }));

      setIsEditing(false);
      show({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      show({
        title: "Error",
        description: "Failed to update profile"
      });
    }
  };

  return (
    <DashboardLayout userRole="faculty">
      <div className="max-w-4xl mx-auto space-y-8" ref={containerRef}>
        {/* Profile Header */}
        <motion.div 
          className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img 
                src={facultyData.profileImage} 
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
                {facultyData.personalInfo.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {facultyData.personalInfo.designation}
              </p>
              <p className="text-sm text-gray-500">
                Joined {new Date(facultyData.personalInfo.joiningDate).toLocaleDateString()}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div 
            className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Personal Information
            </h2>
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <input
                  type="tel"
                  name="phone"
                  defaultValue={facultyData.personalInfo.phone}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="address"
                  defaultValue={facultyData.personalInfo.address}
                  className="form-input"
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
                  <span>{facultyData.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{facultyData.personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{facultyData.personalInfo.address}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Assigned Courses */}
          <motion.div className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Assigned Courses</h2>
            <div className="space-y-4">
              {facultyData.courses.map(course => (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded-lg cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{course.students}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Attendance Summary */}
          <motion.div className="profile-section bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm md:col-span-2 hover:shadow-lg transition-all duration-300">
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
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(facultyData.attendance.present / facultyData.attendance.total) * 100}%` 
                }}
                className="bg-blue-600 h-2 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
