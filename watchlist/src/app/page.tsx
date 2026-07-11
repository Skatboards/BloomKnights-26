const navItems = ["Overview", "Workspace", "Activity", "Settings"];

const stats = [
  { label: "Active projects", value: "24" },
  { label: "Open tasks", value: "138" },
  { label: "Team members", value: "16" },
];

const features = [
  "Unified dashboard",
  "Shared timelines",
  "Priority tracking",
  "Insight reports",
  "Role controls",
  "Fast search",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a
            href="#top"
            className="text-base font-semibold tracking-wide text-white"
          >
            Slate
          </a>
          <div className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] p-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/10 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href="#overview"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200"
          >
            Launch
          </a>
        </div>
      </nav>

      <section id="top" className="border-b border-white/10 bg-neutral-950">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
              Operations Console
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
              A calm command center for everyday work.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Track priorities, surface activity, and keep moving through a
              focused dark interface designed for a general-purpose web app.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#workspace"
                className="rounded-md bg-cyan-300 px-5 py-3 text-center text-sm font-semibold text-neutral-950 transition hover:bg-cyan-200"
              >
                View workspace
              </a>
              <a
                href="#activity"
                className="rounded-md border border-white/15 px-5 py-3 text-center text-sm font-semibold text-neutral-100 transition hover:border-white/30 hover:bg-white/10"
              >
                Recent activity
              </a>
            </div>
          </div>

          <div className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40">
            <div className="rounded-md border border-white/10 bg-neutral-900 p-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-300">
                  Today
                </span>
                <span className="rounded bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-300">
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {[72, 46, 88, 64].map((width, index) => (
                  <div key={width} className="rounded-md bg-white/[0.04] p-3">
                    <div className="mb-3 h-2 w-24 rounded bg-neutral-700" />
                    <div
                      className="h-2 rounded bg-cyan-300/80"
                      style={{ width: `${width}%` }}
                    />
                    <p className="mt-3 text-sm text-neutral-400">Queue {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-md border border-white/10 bg-neutral-900 p-4"
                >
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="border-b border-white/10 bg-neutral-900">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Overview
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Everything important stays in view.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-md border border-white/10 bg-neutral-950 p-5"
                >
                  <div className="mb-6 h-8 w-8 rounded bg-cyan-300/20" />
                  <h3 className="font-medium text-white">{feature}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-400">
                    Flexible placeholder content for a polished application front page.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workspace" className="border-b border-white/10 bg-neutral-950">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-3 lg:px-10">
          <div className="lg:col-span-1">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Workspace
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white">
              Built for scrolling, scanning, and focus.
            </h2>
          </div>
          <div className="space-y-4 lg:col-span-2">
            {["Planning", "Execution", "Review"].map((item) => (
              <div
                key={item}
                className="rounded-md border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-medium text-white">{item}</h3>
                  <span className="text-sm text-neutral-500">0{item.length}</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="h-24 rounded bg-neutral-900" />
                  <div className="h-24 rounded bg-neutral-900" />
                  <div className="h-24 rounded bg-neutral-900" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="activity" className="border-b border-white/10 bg-neutral-900">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Activity</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["New update", "Team note", "System event"].map((item) => (
              <article
                key={item}
                className="rounded-md border border-white/10 bg-neutral-950 p-6"
              >
                <p className="text-sm text-cyan-300">Just now</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item}</h3>
                <p className="mt-4 text-sm leading-6 text-neutral-400">
                  A compact feed item that keeps the front page feeling active without adding another route.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="settings" className="bg-neutral-950">
        <div className="mx-auto flex min-h-96 w-full max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Settings</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            A simple final band keeps the page continuous and ready to expand.
          </h2>
        </div>
      </section>
    </main>
  );
}
