import { cookies } from "next/headers"

async function getData() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/task/simple_list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + cookies().get("session")?.value
        }
    }
  )

  if(!res.ok) {
      return null
  }
  const data = await res.json()

  return data
}


export default async function Page() {
  const data = await getData();
  const rows = data.map((row, index) => {
    const creationDate = new Date(row["creation_date"]).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    return(
      <tr key={index}>
        <td className="border-2 border-gray-800 pl-2">{row["id"]}</td>
        <td className="border-2 border-gray-800 pl-2">{row["device_name"]}</td>
        <td className="border-2 border-gray-800 pl-2">{creationDate}</td>
        <td className="border-2 border-gray-800 pl-2">{row["shelf_no"]}</td>
        <td className="border-2 border-gray-800 pl-2">{row["shelf_floor_no"]}</td>
        <td className="border-2 border-gray-800 pl-2">{row["supervisor_name"]}</td>
        <td className="border-2 border-gray-800 pl-2">{row["other_location"]}</td>
      </tr>
    )
  })
  return (
    <>
      <h2 className="text-4xl font-extrabold mb-6">Liste</h2>
      <table className="w-full text-left text-gray-500">
        <thead>
          <tr>
            <th className="border-2 border-gray-800 pl-2 w-1/12">ID</th>
            <th className="border-2 border-gray-800 pl-2 w-1/3">Gerätename</th>
            <th className="border-2 border-gray-800 pl-2 w-1/12">Erstelldatum</th>
            <th className="border-2 border-gray-800 pl-2 w-1/12">Schrank</th>
            <th className="border-2 border-gray-800 pl-2 w-1/12">Fach</th>
            <th className="border-2 border-gray-800 pl-2 w-1/12">Name</th>
            <th className="border-2 border-gray-800 pl-2 w-1/3">Info</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </>
  )
}