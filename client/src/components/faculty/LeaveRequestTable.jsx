import { useEffect, useState } from 'react';
import { listLeaveRequests, updateLeaveStatus } from '../../services/leaveService';

export default function LeaveRequestTable() {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const data = await listLeaveRequests();
    setRequests(data);
  };

  useEffect(() => { load(); }, []);

  const review = async (id, status) => {
    const comment = window.prompt('Review comment (optional)');
    await updateLeaveStatus(id, { status, review_comment: comment });
    await load();
    alert('Updated');
  };

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="border-b"><th>Student</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-3 py-2">{r.student_name || r.user_name}</td>
              <td className="px-3 py-2">{r.start_date}</td>
              <td className="px-3 py-2">{r.end_date}</td>
              <td className="px-3 py-2">{r.reason}</td>
              <td className="px-3 py-2">{r.status}</td>
              <td className="px-3 py-2">
                <button onClick={() => review(r.id, 'approved')} className="mr-2 text-green-600">Approve</button>
                <button onClick={() => review(r.id, 'rejected')} className="text-red-600">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
