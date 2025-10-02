import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
        <div className="container-xl pt-14 pb-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                Hire top <span className="text-brand">tech talent</span> faster
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                A streamlined platform to post jobs, manage applicants, and
                discover pre-vetted engineers.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/employer/post"
                  className="px-5 py-3 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark"
                >
                  Post a Job
                </Link>
                <Link
                  to="/jobs"
                  className="px-5 py-3 rounded-lg border font-medium hover:border-brand hover:text-brand"
                >
                  Browse Jobs
                </Link>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                No credit card required. Free trial available.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-xl bg-white p-4 shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop"
                  className="rounded-lg w-full h-72 object-cover"
                  alt="Hero visual"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden md:block h-28 w-28 rounded-2xl bg-brand/10 blur-2xl" />
            </div>
          </div>

          {/* Trusted by logos */}
          <div className="mt-14">
            <p className="text-center text-gray-500">Trusted by teams at</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
              {[
                "Google",
                "Microsoft",
                "Amazon",
                "Flipkart",
                "Infosys",
                "Swiggy",
              ].map((company, idx) => (
                <div
                  key={idx}
                  className="flex h-12 items-center justify-center rounded bg-white shadow-sm border"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="container-xl py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">
          Everything you need to hire better
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              t: "Targeted Job Posts",
              d: "Reach experienced developers with precise filters and tags.",
            },
            {
              t: "Applicant Tracking",
              d: "Kanban-style pipeline with stages, notes, tags, and email.",
            },
            {
              t: "Company Pages",
              d: "Tell your story with media, benefits, and culture highlights.",
            },
            {
              t: "Smart Search",
              d: "Boolean search and saved queries to rediscover talent quickly.",
            },
            {
              t: "Automations",
              d: "Auto-responders, reminders, nudges, and rejection flows.",
            },
            {
              t: "Insights",
              d: "Source analytics, funnel conversion, time-to-hire trends.",
            },
          ].map((f) => (
            <div
              key={f.t}
              className="rounded-xl border bg-white p-6 shadow-soft hover:shadow-md transition"
            >
              <div className="h-10 w-10 rounded bg-brand/10 mb-4"></div>
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-y">
        <div className="container-xl py-14 text-center">
          <h3 className="text-2xl font-bold">Start hiring in minutes</h3>
          <p className="mt-2 text-gray-600">
            Create a job post and reach thousands of engineers.
          </p>
          <Link
            to="/pricing"
            className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 font-medium text-white hover:bg-brand-dark"
          >
            See Pricing
          </Link>
        </div>
      </section>
    </>
  );
}
