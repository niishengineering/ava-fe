import React, { useState, useMemo, useEffect } from "react";
import { Avatar } from "@chakra-ui/react";
import { useGetCustomerPageVisits } from "@/libs/Hooks/PageTrackerHooks";

type PageVisit = {
  id: string;
  pageUrl: string;
  visitedAt: Date;
  duration?: number; // in seconds
};

type PageHistoryProps = {
  userName: string;
  customerId: string;
  userAvatar?: string;
  visits: PageVisit[];
  onClose?: () => void;
};

const PageHistory: React.FC<PageHistoryProps> = ({
  userName,
  userAvatar,
  visits,
  customerId,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useGetCustomerPageVisits(customerId);

  // Get unique dates for filter dropdown
  const availableDates = useMemo(() => {
    const dates = visits.map((visit) =>
      visit.visitedAt.toLocaleDateString("en-US")
    );
    return Array.from(new Set(dates)).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [visits]);

  // Filter visits based on selected date and search query
  const filteredVisits = useMemo(() => {
    return visits
      .filter((visit) => {
        const matchesDate =
          !selectedDate ||
          visit.visitedAt.toLocaleDateString("en-US") === selectedDate;

        const matchesSearch =
          !searchQuery ||
          visit.pageUrl.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesDate && matchesSearch;
      })
      .sort((a, b) => b.visitedAt.getTime() - a.visitedAt.getTime());
  }, [visits, selectedDate, searchQuery]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const groupedVisits = useMemo(() => {
    const groups: { [key: string]: PageVisit[] } = {};
    filteredVisits.forEach((visit) => {
      const dateKey = formatDate(visit.visitedAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(visit);
    });
    return groups;
  }, [filteredVisits]);

  //getting data
  useEffect(() => {
    console.log({ data, customerId });
  }, [customerId, data]);

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
            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search page URLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <div className="min-w-[200px]">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Dates</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedDate || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDate("");
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredVisits.length} of {visits.length} visits
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {Object.keys(groupedVisits).length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500">No page visits found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedVisits).map(([date, visits]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {visits.map((visit) => (
                      <div
                        key={visit.id}
                        className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        {/* Time */}
                        <div className="flex-shrink-0 text-center w-20">
                          <div className="text-xs text-gray-500">Time</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatTime(visit.visitedAt)}
                          </div>
                        </div>

                        {/* URL */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 mb-1">
                            Page URL
                          </div>
                          <a
                            href={visit.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
                          >
                            {visit.pageUrl}
                          </a>
                        </div>

                        {/* Duration */}
                        <div className="flex-shrink-0 text-center w-24">
                          <div className="text-xs text-gray-500">Duration</div>
                          <div className="text-sm font-medium text-gray-700">
                            {formatDuration(visit.duration)}
                          </div>
                        </div>

                        {/* External Link Icon */}
                        <a
                          href={visit.pageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
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
