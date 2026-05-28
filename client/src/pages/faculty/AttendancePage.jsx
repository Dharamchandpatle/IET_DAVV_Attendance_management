import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { AttendanceSection } from '../../components/faculty/AttendanceSection';

// Wrap AttendanceSection with DashboardLayout so faculty pages share the sidebar
export default function AttendancePage() {
	return (
		<DashboardLayout userRole="faculty">
			<AttendanceSection />
		</DashboardLayout>
	);
}
