"use client";

import { useCallback, useEffect, useState } from "react";

interface Announcement {
  id: string;
  message: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

interface Props {
  apiRequest: <T>(
    url: string,
    init?: RequestInit
  ) => Promise<T>;

  addToast: (
    type: "success" | "error",
    message: string
  ) => void;

  requestConfirm: (options: {
    title: string;
    message: string;
    confirmLabel: string;
    action: () => Promise<void>;
  }) => void;
}

export function AdminAnnouncementManager(props: Props) {
  const {
    apiRequest,
    addToast,
    requestConfirm,
  } = props;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);

    try {
      const response = await apiRequest<{
        announcements: Announcement[];
      }>("/api/admin/announcements");

      setAnnouncements(response.announcements ?? []);
    } catch {
      addToast("error", "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }, [apiRequest, addToast]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  async function createAnnouncement() {
    if (!message.trim()) {
      addToast("error", "Message cannot be empty.");
      return;
    }

    try {
      await apiRequest("/api/admin/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          display_order: displayOrder,
          is_active: true,
        }),
      });

      addToast("success", "Announcement created.");

      setMessage("");
      setDisplayOrder(1);

      await loadAnnouncements();
    } catch {
      addToast("error", "Unable to create announcement.");
    }
  }

  function deleteAnnouncement(id: string) {
    requestConfirm({
      title: "Delete Announcement",
      message: "Are you sure you want to delete this announcement?",
      confirmLabel: "Delete",

      action: async () => {
        try {
          await apiRequest("/api/admin/announcements", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
            }),
          });

          addToast("success", "Announcement deleted.");

          await loadAnnouncements();
        } catch {
          addToast("error", "Delete failed.");
        }
      },
    });
  }

  async function toggleAnnouncement(item: Announcement) {
    try {
      await apiRequest("/api/admin/announcements", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...item,
          is_active: !item.is_active,
        }),
      });

      addToast("success", "Announcement updated.");

      await loadAnnouncements();
    } catch {
      addToast("error", "Update failed.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold">
          Announcement Manager
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Announcement message"
            className="rounded-lg border p-3"
          />

          <input
            type="number"
            min={1}
            value={displayOrder}
            onChange={(e) =>
              setDisplayOrder(Number(e.target.value))
            }
            className="rounded-lg border p-3"
          />
        </div>

        <button
          onClick={createAnnouncement}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          Add Announcement
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="min-w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-center">Order</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : announcements.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center"
                >
                  No announcements found.
                </td>
              </tr>
            ) : (
              announcements.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0"
                >
                  <td className="p-3">
                    {item.message}
                  </td>

                  <td className="p-3 text-center">
                    {item.display_order}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        toggleAnnouncement(item)
                      }
                      className={`rounded-full px-3 py-1 text-sm ${
                        item.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.is_active
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        deleteAnnouncement(item.id)
                      }
                      className="rounded bg-red-600 px-3 py-1 text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}