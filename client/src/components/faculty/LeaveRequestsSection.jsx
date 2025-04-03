import { Search } from 'lucide-react';

export function LeaveRequestsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Leave Requests</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search requests..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-700"
        />
      </div>
      {/* Add leave requests list here */}
    </div>
  );
}
