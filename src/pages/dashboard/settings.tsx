import React, { useState, useEffect } from "react";
import { ChevronDown, Copy, Plus, X, Upload, Save } from "lucide-react";
import SidebarWithHeader from "@/libs/Layouts/Dashboard";
import { useGetWidgetProperty } from "@/libs/Hooks/propertyChatHook";
import usePropertyChatStore from "@/store/propertyChatStore";
import { useUpdateWidgetProperty } from "@/libs/Hooks/propertyChatHook";
import { toast } from "react-toastify";
import LoadingSpinner from "@/libs/Components/loadingSpinner";

interface PropertyData {
  id: string;
  website: string;
  propertyName: string;
  propertyImage: string | null;
  propertyColor: string;
  welcomeMessage: string;
  suggestedMessages: string[];
  chatMode: "manual" | "auto";
  propertyOwnerId: string;
  createdAt: string;
  updatedAt: string;
}

const PropertyOverview: React.FC = () => {
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );
  const { data: propertyChatData, isLoading } =
    useGetWidgetProperty(selectedProperty);

  // Initialize with default values to prevent uncontrolled inputs
  const getInitialFormData = (): PropertyData => ({
    id: "",
    website: "",
    propertyName: "",
    propertyImage: null,
    propertyColor: "#475266",
    welcomeMessage: "",
    suggestedMessages: [],
    chatMode: "manual",
    propertyOwnerId: "",
    createdAt: "",
    updatedAt: "",
  });

  // Form state
  const [formData, setFormData] = useState<PropertyData>(getInitialFormData());
  const [newSuggestedMessage, setNewSuggestedMessage] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Separate states for image handling
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const updateWidgetPropertyMutation = useUpdateWidgetProperty();

  // Initialize form data when propertyData loads
  useEffect(() => {
    if (propertyChatData) {
      // Ensure no undefined values by providing fallbacks
      const propertyData = {
        id: propertyChatData?.data?.id || "",
        website: propertyChatData?.data?.website || "",
        propertyName: propertyChatData?.data?.propertyName || "",
        propertyImage: propertyChatData?.data?.propertyImage || null,
        propertyColor: propertyChatData?.data?.propertyColor || "#475266",
        welcomeMessage: propertyChatData?.data?.welcomeMessage || "",
        suggestedMessages: propertyChatData?.data?.suggestedMessages || [],
        chatMode: propertyChatData?.data?.chatMode || "manual",
        propertyOwnerId: propertyChatData?.data?.propertyOwnerId || "",
        createdAt: propertyChatData?.data?.createdAt || "",
        updatedAt: propertyChatData?.data?.updatedAt || "",
      };

      setFormData(propertyData);

      // Set the existing image as preview if it exists
      if (propertyData.propertyImage) {
        setImagePreviewUrl(propertyData.propertyImage);
      }
    }
  }, [propertyChatData]);

  // Handle form field changes
  const handleInputChange = (field: keyof PropertyData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsEdited(true);
  };

  // Handle image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Store the actual file for API upload
      setSelectedImageFile(file);

      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);

      // Mark as edited
      setIsEdited(true);
    }
  };

  // Clean up preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // Handle suggested messages
  const addSuggestedMessage = () => {
    if (newSuggestedMessage.trim() !== "") {
      const updatedMessages = [
        ...formData.suggestedMessages,
        newSuggestedMessage.trim(),
      ];
      handleInputChange("suggestedMessages", updatedMessages);
      setNewSuggestedMessage("");
    }
  };

  const removeSuggestedMessage = (index: number) => {
    const updatedMessages = formData.suggestedMessages.filter(
      (_, i) => i !== index
    );
    handleInputChange("suggestedMessages", updatedMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSuggestedMessage();
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Save function - replace with your API call
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const apiData = new FormData();
      apiData.append("website", formData.website);
      apiData.append("propertyName", formData.propertyName);
      apiData.append("propertyColor", formData.propertyColor);
      apiData.append("welcomeMessage", formData.welcomeMessage);
      apiData.append(
        "suggestedMessages",
        JSON.stringify(formData.suggestedMessages)
      );
      apiData.append("chatMode", formData.chatMode);

      // Append the actual file if a new image was selected
      if (selectedImageFile) {
        apiData.append("file", selectedImageFile);
      }

      const response = await updateWidgetPropertyMutation.mutateAsync({
        id: selectedProperty,
        data: apiData,
      });

      toast.success("Property updated successfully!");

      // Reset image file state after successful upload
      setSelectedImageFile(null);
      setIsEdited(false);
    } catch (error) {
      toast.error("Failed to update property");
    } finally {
      setIsSaving(false);
    }
  };

  // Remove image function
  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setFormData((prev) => ({
      ...prev,
      propertyImage: null,
    }));
    setIsEdited(true);
  };

  if (isLoading) {
    return (
      <SidebarWithHeader>
        <div className="w-full mx-auto p-4 flex justify-center items-center h-64">
          <div className="text-gray-500">Loading property data...</div>
        </div>
      </SidebarWithHeader>
    );
  }

  return (
    <SidebarWithHeader title="Settings">
      <div
        className="w-full mx-auto p-4 relative h-[80vh] overflow-y-auto "
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */,
        }}
      >
        <LoadingSpinner showLoadingSpinner={isSaving} />
        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-lg font-medium">Property Overview</h1>
            {isEdited && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-[#101828] text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            )}
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Property Image */}
              <div>
                <p className="text-sm font-medium mb-2">Property Image</p>
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div
                      className="h-16 w-16 flex items-center justify-center text-white text-2xl font-bold rounded overflow-hidden border-2 border-gray-200"
                      style={{ backgroundColor: formData.propertyColor }}
                    >
                      {imagePreviewUrl ? (
                        <img
                          src={imagePreviewUrl}
                          alt="Property"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        formData.propertyName.charAt(0).toUpperCase() || "?"
                      )}
                    </div>

                    {/* Remove image button */}
                    {imagePreviewUrl && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                        title="Remove image"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">
                      We recommend a square image of at least 512x512 for the
                      property. Max file size: 5MB.
                    </p>

                    {/* Show selected file info */}
                    {selectedImageFile && (
                      <p className="text-xs text-green-600 mb-2">
                        Selected: {selectedImageFile.name} (
                        {(selectedImageFile.size / 1024 / 1024).toFixed(2)}MB)
                      </p>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="property-image"
                      onChange={handleImageUpload}
                    />

                    <label
                      htmlFor="property-image"
                      className="inline-flex items-center space-x-2 text-xs bg-white border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload size={14} />
                      <span>Upload Image</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Property Color */}
              <div>
                <p className="text-sm font-medium mb-2">Property Color</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.propertyColor}
                    onChange={(e) =>
                      handleInputChange("propertyColor", e.target.value)
                    }
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.propertyColor}
                    onChange={(e) =>
                      handleInputChange("propertyColor", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded p-2 text-sm"
                    placeholder="#475266"
                  />
                </div>
              </div>

              {/* Property Name */}
              <div>
                <p className="text-sm font-medium mb-2">Property Name</p>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 pr-8 text-sm"
                    value={formData.propertyName}
                    onChange={(e) =>
                      handleInputChange("propertyName", e.target.value)
                    }
                    placeholder="Enter property name"
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => copyToClipboard(formData.propertyName)}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {/* Website */}
              <div>
                <p className="text-sm font-medium mb-2">Website URL</p>
                <div className="relative">
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded p-2 pr-8 text-sm"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => copyToClipboard(formData.website)}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {/* Welcome Message */}
              <div>
                <p className="text-sm font-medium mb-2">Welcome Message</p>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 text-sm h-24"
                  value={formData.welcomeMessage}
                  onChange={(e) =>
                    handleInputChange("welcomeMessage", e.target.value)
                  }
                  placeholder="Enter welcome message for visitors"
                />
              </div>

              {/* Chat Mode */}
              <div>
                <p className="text-sm font-medium mb-2">Chat Mode</p>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 rounded p-2 pr-8 text-sm bg-white"
                    value={formData.chatMode}
                    onChange={(e) =>
                      handleInputChange(
                        "chatMode",
                        e.target.value as "manual" | "auto"
                      )
                    }
                  >
                    <option value="manual">Manual</option>
                    <option value="ai">AI</option>
                    <option value="user">USER</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Property ID */}
              <div>
                <p className="text-sm font-medium mb-2">Property ID</p>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 pr-8 text-sm bg-gray-50"
                    value={formData.id}
                    readOnly
                    placeholder="Property ID will be generated"
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => copyToClipboard(formData.id)}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {/* Suggested Messages */}
              <div>
                <p className="text-sm font-medium mb-2">Suggested Messages</p>
                <div className="flex mb-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-l p-2 text-sm"
                    placeholder="Add suggested message"
                    value={newSuggestedMessage}
                    onChange={(e) => setNewSuggestedMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="bg-gray-50 border border-l-0 border-gray-300 rounded-r px-3 py-2 text-xs flex items-center justify-center hover:bg-gray-100"
                    onClick={addSuggestedMessage}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div
                  className="space-y-2 h-[380px] overflow-y-auto p-2 border shadow rounded "
                  style={{
                    scrollbarWidth: "none" /* Firefox */,
                    msOverflowStyle: "none" /* IE and Edge */,
                  }}
                >
                  {formData.suggestedMessages.map((message, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded text-sm"
                    >
                      <span>{message}</span>
                      <button
                        onClick={() => removeSuggestedMessage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {formData.suggestedMessages.length === 0 && (
                    <p className="text-xs text-gray-500">
                      No suggested messages added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={!isEdited || isSaving}
                className="w-full bg-[#101828] text-white rounded-md py-2 text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SidebarWithHeader>
  );
};

export default PropertyOverview;
