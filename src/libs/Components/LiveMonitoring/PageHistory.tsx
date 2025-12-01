import React, { useState, useMemo, useEffect } from "react";
import { Avatar } from "@chakra-ui/react";
import { useGetCustomerPageVisits } from "@/libs/Hooks/PageTrackerHooks";
import { getChatSentTime } from "@/libs/utilities";

interface PageVisit {
  id: string;
  customerId: string;
  pageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

type PageHistoryProps = {
  userName: string;
  customerId: string;
  userAvatar?: string;
  onClose?: () => void;
};

const PageHistory: React.FC<PageHistoryProps> = ({
  userName,
  userAvatar,
  customerId,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useGetCustomerPageVisits(customerId);
  const [visits, setVisits] = useState<PageVisit[]>([]);

  // Convert createdAt / updatedAt to real Date objects
  useEffect(() => {
    if (data?.data) {
      const converted = data.data.map(
        (item: any): PageVisit => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })
      );

      setVisits(converted);
    }
  }, [customerId, data]);

  // Unique dates for dropdown
  const availableDates = useMemo(() => {
    const dates = visits.map((visit) =>
      visit.createdAt.toLocaleDateString("en-US")
    );

    return Array.from(new Set(dates)).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [visits]);

  // Filter data
  const filteredVisits = useMemo(() => {
    return visits
      .filter((visit) => {
        const matchesDate =
          !selectedDate ||
          visit.createdAt.toLocaleDateString("en-US") === selectedDate;

        const matchesSearch =
          !searchQuery ||
          visit.pageUrl.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesDate && matchesSearch;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [visits, selectedDate, searchQuery]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group visits by date
  const groupedVisits = useMemo(() => {
    const groups: { [key: string]: PageVisit[] } = {};
    filteredVisits.forEach((visit) => {
      const dateKey = formatDate(visit.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(visit);
    });
    return groups;
  }, [filteredVisits]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="md" name={userName} src={userAvatar} />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Page History</h2>
              <p className="text-sm text-gray-500">{userName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="border-b px-6 py-4 bg-gray-50">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search page URLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>

            <div className="min-w-[200px]">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
              >
                <option value="">All Dates</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>

            {(selectedDate || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDate("");
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-sm text-gray-600"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredVisits.length} of {visits.length} visits
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {Object.keys(groupedVisits).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No page visits found
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedVisits).map(([date, visits]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {visits.map((visit) => (
                      <div
                        key={visit.id}
                        className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
                      >
                        <div className="flex-shrink-0 text-center w-20">
                          <div className="text-xs text-gray-500">Time</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {getChatSentTime(visit.createdAt)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 mb-1">
                            Page URL
                          </div>
                          <a
                            href={visit.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate block"
                          >
                            {visit.pageUrl}
                          </a>
                        </div>

                        <a
                          href={visit.pageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-gray-400 hover:text-blue-600"
                        >
                          ↗
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHistory;
