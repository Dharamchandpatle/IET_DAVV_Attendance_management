import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, updateStudentProfile } from '../../services/studentProfileService';

export default function StudentProfile() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [profile, setProfile] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			try {
				const id = user?.id;
				if (!id) return;
				let data = null;
				try {
					data = await getStudentProfile(id);
				} catch (err) {
					console.warn('Failed to fetch student profile from API, falling back to auth user', err);
				}
				if (!data) {
					// fallback to local auth user object
					data = {
						id: user.id,
						name: user.name,
						email: user.email,
						phone: user.phone,
						roll_number: user.roll_number,
						department_name: user.department_name,
						semester: user.semester,
						section: user.section,
						admission_year: user.admission_year,
						cgpa: user.cgpa,
						profile_image: user.profile_image
					};
				}
				if (mounted) setProfile(data);
			} catch (err) {
				toast.error('Failed to load profile');
			} finally {
				if (mounted) setIsLoading(false);
			}
		};
		load();
		return () => { mounted = false; };
	}, [user?.id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfile(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!profile?.id) return;
		setSaving(true);
		try {
			await updateStudentProfile(profile.id, profile);
			toast.success('Profile updated');
		} catch (err) {
			toast.error('Failed to update profile');
		} finally {
			setSaving(false);
		}
	};

	if (isLoading) {
		return (
			<DashboardLayout userRole="student">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout userRole="student">
			<div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
				<h2 className="text-2xl font-semibold mb-4">My Profile</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm mb-1">Name</label>
						<input name="name" value={profile?.name || ''} onChange={handleChange} className="w-full p-2 border rounded" />
					</div>

					<div>
						<label className="block text-sm mb-1">Email</label>
						<input name="email" value={profile?.email || ''} readOnly className="w-full p-2 border rounded bg-gray-100" />
					</div>

					<div>
						<label className="block text-sm mb-1">Phone</label>
						<input name="phone" value={profile?.phone || ''} onChange={handleChange} className="w-full p-2 border rounded" />
					</div>

					<div className="flex items-center gap-2">
						<button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
							{saving ? 'Saving...' : 'Save Changes'}
						</button>
						<button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
							Back
						</button>
					</div>
				</form>
			</div>
		</DashboardLayout>
	);
}
