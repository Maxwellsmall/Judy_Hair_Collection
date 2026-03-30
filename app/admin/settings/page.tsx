"use client";

import { useState } from "react";



export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "Judy Hair Collection",
    email: "admin@judyhaircollection.com",
    phone: "+39 351 942 0168",
    location: "Genova, Italy",
    whatsappNumber: "393519420168",
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, save to database
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-neutral-900">
          Settings
        </h1>
        <p className="text-neutral-600 font-body mt-2">
          Configure your store settings
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Store Name
          </label>
          <input
            type="text"
            value={settings.storeName}
            onChange={(e) =>
              setSettings({ ...settings, storeName: e.target.value })
            }
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) =>
              setSettings({ ...settings, email: e.target.value })
            }
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) =>
              setSettings({ ...settings, phone: e.target.value })
            }
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={settings.location}
            onChange={(e) =>
              setSettings({ ...settings, location: e.target.value })
            }
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={settings.whatsappNumber}
            onChange={(e) =>
              setSettings({ ...settings, whatsappNumber: e.target.value })
            }
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            placeholder="2347068383089"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-neutral-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
