import { OldestOpenTask } from '@/server/statistics'

interface Props {
  tasks: OldestOpenTask[]
}

export default function OldestOpenTasksTable({ tasks }: Props) {
  if (tasks.length === 0) {
    return <p className="text-gray-400">Keine offenen Aufgaben vorhanden.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wide">
            <th className="pb-3 pr-6">ID</th>
            <th className="pb-3 pr-6">Gerät</th>
            <th className="pb-3 pr-6">Erstellt am</th>
            <th className="pb-3 pr-6">Offen seit</th>
            <th className="pb-3 pr-6">Letzter Kommentar</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 pr-6 font-mono text-gray-500">#{task.id}</td>
              <td className="py-3 pr-6 font-medium text-gray-800">{task.device_name}</td>
              <td className="py-3 pr-6 text-gray-600">{task.creation_date}</td>
              <td className="py-3 pr-6">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                  task.days_open > 180
                    ? 'bg-red-100 text-red-700'
                    : task.days_open > 90
                    ? 'bg-orange-100 text-orange-700'
                    : task.days_open > 30
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {task.days_open} Tage
                </span>
              </td>
              <td className="py-3 pr-6 text-gray-600">
                  {task.last_comment_date
                    ? new Date(task.last_comment_date).toLocaleDateString('de-DE')
                    : <span className="text-gray-400">–</span>}
                </td>
              <td className="py-3 text-right">
                <a
                  href={`/task/${task.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Zur Aufgabe
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
