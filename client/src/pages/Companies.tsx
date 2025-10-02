
import { Link } from 'react-router-dom'

const companies = Array.from({length: 12}).map((_,i)=>({
  id: i+1,
  name: ['Acme Corp','Globex','Innotech','Umbrella','Soylent','Hooli'][i%6],
  size: ['11–50','51–200','201–500','500+'][i%4],
  location: ['Bengaluru','Remote','Pune','Hyderabad'][i%4],
  tagline: 'We build delightful products for millions of users.'
}))

export default function Companies() {
  return (
    <div className="container-xl py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-gray-600">Explore company pages</p>
        </div>
        <input placeholder="Search companies..." className="w-full sm:w-80 rounded-md border px-3 py-2"/>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(c => (
          <Link key={c.id} to={`/companies/${c.id}`} className="rounded-xl border bg-white p-5 hover:border-brand">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-gray-200"></div>
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-600">{c.location} • {c.size}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">{c.tagline}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
