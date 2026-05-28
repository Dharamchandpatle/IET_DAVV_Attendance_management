import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { LeaveRequestsSection } from '../../components/faculty/LeaveRequestsSection';

export default function LeaveRequestsPage() {
  return (
    <DashboardLayout userRole="faculty">
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leave Requests</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Review and manage student leave requests</p>
          </div>
        </header>

        <LeaveRequestsSection />
      </div>
    </DashboardLayout>
  );
}