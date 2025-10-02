
export default function Pricing() {
  const tiers = [
    {name:'Starter', price:'₹0', features:['1 job post','Basic branding','Community support'], cta:'Get started'},
    {name:'Growth', price:'₹4,999/mo', features:['10 job posts','Company page','Email automations'], cta:'Start trial', highlight: true},
    {name:'Scale', price:'₹14,999/mo', features:['Unlimited posts','ATS integrations','Dedicated support'], cta:'Contact sales'},
  ]
  return (
    <div className="container-xl py-14">
      <h1 className="text-3xl font-bold text-center">Simple, transparent pricing</h1>
      <p className="mt-2 text-center text-gray-600">Choose a plan that fits your hiring needs</p>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {tiers.map(t => (
          <div key={t.name} className={`rounded-2xl border bg-white p-6 shadow-soft ${t.highlight ? 'border-brand' : ''}`}>
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="mt-1 text-3xl font-extrabold">{t.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {t.features.map(f => <li key={f} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand"></span>{f}</li>)}
            </ul>
            <button className={`mt-6 w-full rounded-lg px-4 py-2 font-medium ${t.highlight ? 'bg-brand text-white' : 'border hover:border-brand hover:text-brand'}`}>{t.cta}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
