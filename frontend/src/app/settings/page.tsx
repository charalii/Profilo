"use client";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="mt-8 space-y-8">
        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your account details and CV profile.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Your Name"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900">Email Alerts</h2>
          <p className="mt-1 text-sm text-gray-500">Configure when and how you receive match alerts.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Frequency</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Match Score</label>
              <input type="number" className="mt-1 w-32 rounded-md border px-3 py-2 text-sm" defaultValue={60} min={0} max={99} />
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
          <p className="mt-1 text-sm text-gray-500">You are on the <strong>Free</strong> plan.</p>
          <a href="/pricing" className="mt-4 inline-block rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            Upgrade Plan
          </a>
        </section>
      </div>
    </div>
  );
}
