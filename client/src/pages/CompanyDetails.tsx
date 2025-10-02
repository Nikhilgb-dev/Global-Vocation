
import { useParams, Link } from 'react-router-dom'

export default function CompanyDetails() {
  const { id } = useParams()
  return (
    <div className="container-xl py-10">
      <Link to="/companies" className="text-sm text-gray-600 hover:text-brand">← Back to companies</Link>
      <div className="mt-4 grid gap-6 md:grid-cols-[1fr,360px]">
        <article className="rounded-xl border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded bg-gray-200"></div>
            <div>
              <h1 className="text-2xl font-bold">Acme Corp</h1>
              <p className="text-gray-600">Bengaluru • 201–500 employees</p>
            </div>
          </div>
          <div className="mt-4 prose prose-sm max-w-none">
            <p>Acme builds delightful productivity tools used by millions. We value craftsmanship, autonomy, and speed.</p>
            <h3>Benefits</h3>
            <ul>
              <li>Remote-friendly</li>
              <li>ESOPs</li>
              <li>Health insurance for family</li>
            </ul>
          </div>
        </article>
        <aside className="rounded-xl border bg-white p-6 h-fit">
          <h3 className="font-semibold">Open roles</h3>
          <ul className="mt-3 grid gap-3 text-sm">
            <li><Link to="/jobs/1" className="text-brand hover:underline">Senior Frontend Engineer</Link></li>
            <li><Link to="/jobs/2" className="text-brand hover:underline">Backend Engineer</Link></li>
            <li><Link to="/jobs/3" className="text-brand hover:underline">DevOps Engineer</Link></li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
