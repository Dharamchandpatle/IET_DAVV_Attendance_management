// import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Check, Clock, FileText, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { AttendanceSection } from '../../components/faculty/AttendanceSection';
import { LeaveRequestsSection } from '../../components/faculty/LeaveRequestsSection';
import { useAuth } from '../../context/AuthContext';
import { getMyFaculty } from '../../services/facultyService';

const dashboardSections = [
	{
		id: 'attendance',
		title: 'Mark Attendance',
		description: 'Record today\'s attendance',
		icon: Calendar,
		color: 'blue',
		component: AttendanceSection,
		path: '/faculty/attendance'
	},
	{
		id: 'leave-requests',
		title: 'Leave Requests',
		description: 'Review pending requests',
		icon: Clock,
		color: 'green',
		component: LeaveRequestsSection,
		path: '/faculty/leave-requests'
	}
];

const sectionColorClasses = {
	blue: {
		bg: 'bg-blue-100 dark:bg-blue-900/20',
		icon: 'text-blue-600 dark:text-blue-400'
	},
	green: {
		bg: 'bg-green-100 dark:bg-green-900/20',
		icon: 'text-green-600 dark:text-green-400'
	},
	purple: {
		bg: 'bg-purple-100 dark:bg-purple-900/20',
		icon: 'text-purple-600 dark:text-purple-400'
	}
};

export default function FacultyDashboard() {
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [facultyData, setFacultyData] = useState(null);
	const navContainerRef = useRef(null);
	const navItemRefs = useRef([]);
	const [navSlider, setNavSlider] = useState({ left: 0, width: 0, opacity: 0 });
	const navigate = useNavigate();
	const location = useLocation();

	// Fetch faculty data on mount
	useEffect(() => {
		let isActive = true;

		const loadDashboardData = async () => {
			try {
				setIsLoading(true);
				if (!user?.id) return;
				const data = await getMyFaculty();
				if (!isActive) return;

				// Normalize fallback values for KPI rendering
				const normalized = {
					id: data?.id || user?.id,
					name: data?.name || user?.name,
					email: data?.email || user?.email,
					phone: data?.phone || user?.phone || '',
					faculty_code: data?.faculty_code || user?.faculty_code,
					department_name: data?.department_name || user?.department_name || 'Computer Science',
					designation: data?.designation || user?.designation || 'Assistant Professor',
					joining_date: data?.joining_date || user?.joining_date,
					specialization: data?.specialization || user?.specialization || '',
					profile_image: data?.profile_image || user?.profile_image,
					assigned_courses: data?.assigned_courses ?? data?.courses?.length ?? 0,
					total_students: data?.total_students ?? 0,
					classes_today: data?.classes_today ?? 0,
					attendance_marked: data?.attendance_marked ?? (data?.attendance?.percent ? `${data.attendance.percent}%` : null)
				};

				setFacultyData(normalized);
			} catch (error) {
				if (!isActive) return;
				const fallback = {
					id: user?.id,
					name: user?.name,
					email: user?.email,
					phone: user?.phone || '',
					faculty_code: user?.faculty_code,
					department_name: user?.department_name || 'Computer Science',
					designation: user?.designation || 'Assistant Professor',
					joining_date: user?.joining_date,
					specialization: user?.specialization || '',
					profile_image: user?.profile_image,
					assigned_courses: 0,
					total_students: 0,
					classes_today: 0,
					attendance_marked: '0%'
				};
				setFacultyData(fallback);
				if (!(error?.response?.status === 404)) {
					toast.error('Failed to load dashboard data');
				}
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		loadDashboardData();

		return () => {
			isActive = false;
		};
	}, [user?.id]);

	const activeSection = useMemo(() => {
		const match = dashboardSections.find(section => section.path === location.pathname);
		return match?.id || 'attendance';
	}, [location.pathname]);

	const ActiveComponent = useMemo(() => {
		return dashboardSections.find(section => section.id === activeSection)?.component || AttendanceSection;
	}, [activeSection]);

	useEffect(() => {
		const updateNavSlider = () => {
			const container = navContainerRef.current;
			const idx = dashboardSections.findIndex(s => s.id === activeSection);
			const refs = navItemRefs.current || [];
			if (!container || !refs[idx]) {
				setNavSlider(s => ({ ...s, opacity: 0 }));
				return;
			}
			const cRect = container.getBoundingClientRect();
			const bRect = refs[idx].getBoundingClientRect();
			const left = bRect.left - cRect.left + container.scrollLeft + 12;
			const width = Math.max(40, bRect.width - 24);
			setNavSlider({ left: `${left}px`, width: `${width}px`, opacity: 1 });
		};

		requestAnimationFrame(updateNavSlider);
		window.addEventListener('resize', updateNavSlider);
		return () => window.removeEventListener('resize', updateNavSlider);
	}, [activeSection]);

	if (isLoading || !facultyData) {
		return (
			<DashboardLayout userRole="faculty" isLoading={isLoading}>
				<div className="flex items-center justify-center h-96">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			</DashboardLayout>
		);
	}

	const facultyKPIs = [
		{ title: 'Assigned Courses', value: String(facultyData.assigned_courses ?? 0), icon: FileText },
		{ title: 'Total Students', value: String(facultyData.total_students ?? 0), icon: Users },
		{ title: 'Classes Today', value: String(facultyData.classes_today ?? 0), icon: Clock },
		{ title: 'Attendance Marked', value: (() => {
			const v = facultyData.attendance_marked;
			if (v == null) return '0%';
			if (typeof v === 'string') return v;
			if (typeof v === 'number') {
				if (v > 0 && v <= 1) return `${Math.round(v * 100)}%`;
				return `${v}%`;
			}
			return String(v);
		})(), icon: Check },
	];


	const handleSectionChange = (sectionId) => {
		const section = dashboardSections.find(s => s.id === sectionId);
		if (section && section.path) {
			navigate(section.path, { replace: true });
		}
	};

	return (
		<DashboardLayout userRole="faculty" isLoading={isLoading}>
			<div className="space-y-8">
				{/* KPI Grid */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					{facultyKPIs.map((kpi, index) => (
						<div
							key={kpi.title}
							className="dashboard-card bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
						>
							<div className="flex items-center gap-4">
								<div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transform transition-transform group-hover:scale-110">
									<kpi.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{kpi.title}</p>
									<h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">{kpi.value}</h3>
								</div>
							</div>
						</div>
					))}
				</div>

								{/* Section Navigation */}
								<div className="relative">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6" ref={navContainerRef}>
										{dashboardSections.map((section, index) => {
						const colorClasses = sectionColorClasses[section.color] || sectionColorClasses.blue;

						return (
														<button
																key={section.id}
																ref={(el) => (navItemRefs.current[index] = el)}
																onClick={() => handleSectionChange(section.id)}
																className={`relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm dashboard-card overflow-hidden
																								 ${activeSection === section.id ? 'ring-2 ring-blue-500' : ''}`}>
								<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-gray-700/5 dark:to-gray-700/10 transform -skew-y-12" />
								<div
									className={`relative w-12 h-12 rounded-lg ${colorClasses.bg}
													 flex items-center justify-center mb-4 transform transition-transform duration-300 hover:scale-110`}
								>
									<section.icon className={`w-6 h-6 ${colorClasses.icon}`} />
								</div>
								<h3 className="relative text-lg font-semibold mb-2">{section.title}</h3>
								<p className="relative text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
							</button>
						);
					})}
									</div>
									<div
										aria-hidden
										className="absolute bottom-0 h-1 bg-blue-600 dark:bg-blue-400 rounded transition-all"
										style={{ left: navSlider.left, width: navSlider.width, opacity: navSlider.opacity }}
									/>
								</div>

				{/* Active Section Content */}
				<div
					className="section-content"
				>
					<ActiveComponent />
				</div>
			</div>
		</DashboardLayout>
	);
}
