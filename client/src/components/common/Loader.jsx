import { LoadingSpinner } from '../ui/LoadingSpinner';

export default function Loader() {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <LoadingSpinner />
    </div>
  );
}
