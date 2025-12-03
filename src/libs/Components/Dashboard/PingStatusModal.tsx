import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  Clock,
  Globe,
  RefreshCw,
  Activity,
  X,
} from "lucide-react";
import usePropertyChatStore from "@/store/propertyChatStore";
import {
  usePingWidgetProperty,
  useGetWidgetProperty,
} from "@/libs/Hooks/propertyChatHook";
import { toast } from "react-toastify";
import { ChatWidgetPropertyInterface } from "@/libs/interface";

interface WebsiteData {
  name: string;
  url: string;
  status: "online" | "offline";
  lastPing: string;
  responseTime: number;
  uptime: number;
}

interface PingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PingStatusModal: React.FC<PingStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const id = usePropertyChatStore((state: any) => state.selectedProperty);
  const [widgetProperty, setWidgetProperty] =
    useState<ChatWidgetPropertyInterface>();

  const mutation = usePingWidgetProperty();

  const { data } = useGetWidgetProperty(id);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setWidgetProperty(data?.data);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleRefresh = async (): Promise<void> => {
    try {
      setIsRefreshing(true);
      const response: any = await mutation.mutateAsync({ id });
      setWidgetProperty(response?.property);
      console.log("Ping successful:", response);
    } catch (err) {
      console.log("Ping error:", err);
      toast.error("Failed to ping the website");
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastPing = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
  };

  if (!isOpen) return null;

  const isOnline = widgetProperty?.pingStatus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {isLoading ? (
          // Loading State
          <div className="p-12 flex flex-col items-center justify-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading website status...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
              <X className="w-8 h-8" />
            </div>
            <p className="text-gray-900 font-semibold mb-2">Error</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="mt-2 text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
          </div>
        ) : widgetProperty ? (
          // Success State
          <>
            {/* Header with Status */}
            <div
              className={`p-6 ${
                isOnline
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isOnline ? (
                    <div className="bg-white/20 p-3 rounded-full">
                      <Wifi className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="bg-white/20 p-3 rounded-full">
                      <WifiOff className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {isOnline ? "Online" : "Offline"}
                    </h1>
                    <p className="text-white/90 text-sm mt-1">
                      {widgetProperty?.propertyName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6">
              {/* URL */}
              <div className="flex items-center justify-between gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-2">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      Website URL
                    </div>
                    <div className="text-sm font-medium text-gray-900 break-all">
                      {widgetProperty?.website}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRefresh}
                  className=" flex bg-green-500 items-center hover:bg-green-600  text-white p-2 rounded-[12px] transition-colors disabled:opacity-50"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Ping Website
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Status */}
                <div
                  className={`text-center p-4 rounded-lg border ${
                    isOnline
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {isOnline ? (
                    <Wifi className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  ) : (
                    <WifiOff className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  )}
                  <div
                    className={`text-2xl font-bold ${
                      isOnline ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {isOnline ? "UP" : "DOWN"}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Status</div>
                </div>
              </div>

              {/* Last Ping */}
              <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="text-sm text-gray-600">Last checked: </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatLastPing(widgetProperty?.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 text-center text-xs text-gray-500">
              Monitoring • Auto-refresh every 60 seconds
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PingStatusModal;
