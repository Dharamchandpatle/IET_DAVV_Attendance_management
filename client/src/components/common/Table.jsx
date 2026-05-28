
export default function Table({ columns = [], data = [], actions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-left">{c.title}</th>
            ))}
            {actions && <th className="px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((c) => <td key={c.key} className="px-4 py-2">{row[c.key]}</td>)}
              {actions && <td className="px-4 py-2">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
