import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function ReplyModal({ open, onClose, customerEmail }) {
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();

    Inertia.post(route("admin.customers.sendReply"), {
      to: customerEmail,
      from: "Directeur@Techweb.Ma",
      body: message,
    });

    setMessage("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30">
      <div className="w-96 bg-gray-100 bg-opacity-80 dark:bg-gray-800 rounded-xl shadow border border-purple-200 p-6 transition-transform transform hover:scale-105">
        <div className="flex justify-between items-center border-b border-purple-200 pb-3 mb-4">
          <h2 className="font-bold text-xl text-purple-700">Reply to Customer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-lg font-bold"
          >
            ✖
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <p><strong>From :</strong> Directeur@Techweb.Ma</p>
          <p><strong>To :</strong> {customerEmail}</p>
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your reply..."
            className="w-full border border-purple-200 dark:border-purple-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            rows="5"
            required
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
