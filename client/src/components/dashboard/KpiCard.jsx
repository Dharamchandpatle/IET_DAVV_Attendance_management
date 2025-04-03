import { cn } from '../../lib/utils';

export function KpiCard({ title, value, icon: Icon, trend, className }) {
  const isPositive = trend?.startsWith('+');

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
      {trend && (
        <p className={cn(
          "mt-2 text-sm",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {trend} from last month
        </p>
      )}
    </div>
  );
}
