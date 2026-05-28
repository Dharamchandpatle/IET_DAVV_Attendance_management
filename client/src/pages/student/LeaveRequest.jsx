// import { AnimatePresence, motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { LeaveRequestForm } from '../../components/student/LeaveRequestForm';
import { useToast } from '../../components/ui/toast';
import { createLeaveRequest, deleteLeaveRequest, listLeaveRequests, updateLeaveStatus } from '../../services/leaveService';

const mockRequests = [
	{ 
		id: 1, 
		date: '2024-02-15', 
		fromDate: '2024-02-15',
		toDate: '2024-02-16',
		reason: 'Medical Appointment', 
		status: 'pending',
		type: 'medical'
	},
	{ 
		id: 2, 
		date: '2024-02-10', 
		fromDate: '2024-02-10',
		toDate: '2024-02-10',
		reason: 'Family Function', 
		status: 'approved',
		type: 'personal'
	},
];

const statusStyles = {
	approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
	rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
	pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
};

export default function LeaveRequest() {
	const { show } = useToast();
	const [leaveRequests, setLeaveRequests] = useState([]);
	const [loading, setLoading] = useState(true);

	const stats = useMemo(() => {
		return leaveRequests.reduce((acc, req) => {
			acc.total += 1;
			acc[req.status] += 1;
			return acc;
		}, { total: 0, pending: 0, approved: 0, rejected: 0 });
	}, [leaveRequests]);

	// Load leave requests for current student
	const loadRequests = async () => {
		setLoading(true);
		try {
			const data = await listLeaveRequests();
			setLeaveRequests(data || []);
		} catch (err) {
			show({ title: 'Error', description: 'Failed to load leave requests', type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { loadRequests(); }, []);

	const handleLeaveSubmit = async (formData) => {
		try {
			await createLeaveRequest(formData);
			show({ title: "Request Submitted", description: "Your leave request has been submitted successfully.", type: "success" });
			await loadRequests();
		} catch (err) {
			show({ title: 'Error', description: 'Failed to submit leave request', type: 'error' });
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteLeaveRequest(id);
			show({ title: 'Deleted', description: 'Leave request deleted', type: 'success' });
			await loadRequests();
		} catch (err) {
			show({ title: 'Error', description: 'Failed to delete request', type: 'error' });
		}
	};

	const handleCancel = async (id) => {
		try {
			await updateLeaveStatus(id, { status: 'cancelled' });
			show({ title: 'Cancelled', description: 'Leave request cancelled', type: 'success' });
			await loadRequests();
		} catch (err) {
			show({ title: 'Error', description: 'Failed to cancel request', type: 'error' });
		}
	};

	return (
		<DashboardLayout userRole="student">
			<div className="space-y-6">
				<header className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">Leave Requests</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Submit and track your leave applications
						</p>
					</div>
					<div
						className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
					>
						<div className="flex items-center gap-3">
							<Calendar className="w-5 h-5 text-blue-600" />
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
								<p className="text-2xl font-bold">{stats.total}</p>
							</div>
						</div>
					</div>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* New Leave Request Form */}
					<div
						className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
					>
						<h2 className="text-xl font-semibold mb-4">New Leave Request</h2>
						<LeaveRequestForm onSubmit={handleLeaveSubmit} />
					</div>

					{/* Leave History */}
					<div
						className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
					>
						<h2 className="text-xl font-semibold mb-4">Leave History</h2>
						<div className="space-y-4">
							{leaveRequests.map((request) => (
								<div
									key={request.id}
									className="p-4 border dark:border-gray-700 rounded-lg"
								>
										<div className="flex justify-between items-start">
											<div>
												<h3 className="font-medium">
													{new Date(request.fromDate).toLocaleDateString()} 
													{request.fromDate !== request.toDate && 
														` - ${new Date(request.toDate).toLocaleDateString()}`}
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{request.reason}
												</p>
											</div>
											<div className="flex flex-col items-end gap-2">
															<span className={`px-2 py-1 text-xs rounded-full ${statusStyles[request.status] || statusStyles.pending}`}>
																{request.status}
															</span>
															<div className="flex gap-2 mt-2">
																{request.status === 'pending' && (
																	<>
																		<button onClick={() => handleCancel(request.id)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded">Cancel</button>
																		<button onClick={() => handleDelete(request.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded">Delete</button>
																	</>
																)}
															</div>
														</div>
										</div>
								</div>
							))}
							{leaveRequests.length === 0 && (
								<p
									className="text-center text-gray-500 dark:text-gray-400 py-4"
								>
									No leave requests found
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
