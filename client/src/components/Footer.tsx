
import { Link } from 'react-router-dom'

const links = [
  {label:'About', to:'#'},
  {label:'Careers', to:'#'},
  {label:'Blog', to:'#'},
  {label:'Support', to:'#'},
  {label:'Privacy', to:'#'},
  {label:'Terms', to:'#'}
]

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container-xl py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-brand"></div>
              <span className="text-xl font-bold">Hirist<span className="text-brand">Tech</span></span>
            </div>
            <p className="mt-3 text-sm text-gray-600">A modern job platform for tech roles. This is a demo clone for educational use.</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {links.map(l => (
              <Link key={l.label} to={l.to} className="text-sm text-gray-700 hover:text-brand">{l.label}</Link>
            ))}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between border-t pt-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} HiristTech Demo</p>
          <p>Made with ❤️</p>
        </div>
      </div>
    </footer>
  )
}
