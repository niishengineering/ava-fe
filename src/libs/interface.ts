export interface SessionInterface {
  id: string;
  customerId: string;
  browser: string;
  os: string;
  ip: string;
  country: string;
  city: string;
  region: string;
  createdAt: Date; // ISO timestamp
  updatedAt: Date; // ISO timestamp
  firstSeen: Date; // ISO timestamp
  lastSeen: Date; // ISO timestamp
  firstWebSession: Date; // ISO timestamp
  latestWebSession: Date; // ISO timestamp
  totalWebSessions: number;
  pageViews: number;
  timeSpentMinutes: number;
  firstLiveChat: Date; // ISO timestamp
  latestLiveChat: Date; // ISO timestamp
  totalLiveChats: number;
  customer: {
    id: string;
    name: string;
    country: string;
  };
}

export interface updateSociailaInterface {
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  linkedin?: string;
  customerId: string;
}

export interface CustomerTicket {
  id: string;
  sessionId: string;
  siteId: string;
  name: string;
  email: string | null;
  phone?: string | null;
}
export interface SupportAgentTicket {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: string;
}

export interface TicketInterface {
  id: string;
  subject: string;
  message: string;
  priority: "Low" | "Medium" | "High" | "Critical" | string;
  status: "open" | "closed" | "pending" | string;
  createdAt: Date; // ISO date string
  updatedAt: Date; // ISO date string
  createdByUserId: string;
  assignee: string;
  contact: string;
  propertyChatId: string;
  Attachments: string[];
  customer: CustomerTicket;
  supportAgent: SupportAgentTicket;
}

export interface ChatInterface {
  chat: {
    id: string;
    chat: string; // Not clear from context — adjust type if needed (string/object)
    customerId: string;
    mode: string;
    currentSupportAgentId: string;
    supportAgentsId: string[];
    propertyChatId: string;
    messagesId: string[];
    status: "Open" | "Closed" | string; // You can replace with union of known statuses
    createdAt: string; // Consider using Date if parsing it
    updatedAt: string;
    customer: {
      id: string;
      sessionId: string;
      siteId: string;
      name: string | null;
      email: string | null;
      phone: string | null;
      jobTitle: string | null;
      country: string | undefined;
      userAgent: string | null;
    };
    supportAgent: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  lastMessage: {
    id: string;
    senderId: string;
    recipientId: string | null;
    siteId: string;
    messageContent: string;
    messageType: "text" | "image" | string;
    imageContent: string | null;
    isRead: boolean;
    sentAt: Date; // ISO date string
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
}

export interface CustomerChatInterface {
  chat: {
    id: string;
    customerId: string;
    mode: string;
    propertyChatId: string;
    currentSupportAgentId: string | null;
    messagesId: string[];
    supportAgent: {
      firstName: string;
      lastName: string;
    };
    supportAgentsId: string[];
    status: "Open" | "Closed" | "Pending"; // adjust possible values as needed
    createdAt: Date; // or Date if you plan to convert it
    updatedAt: Date; // or Date if you plan to convert it
  };
  lastMessage: CustomerLastMessageInterface;
}

export interface CustomerLastMessageInterface {
  id: string;
  senderId: string;
  recipientId: string | null;
  siteId: string;
  messageContent: string | null;
  imageContent: string | null;
  messageType: "text" | "image" | "file"; // extend with more types if needed
  isRead: boolean;
  sentAt: Date; // ISO timestamp, or Date if you prefer
  createdAt: Date; // ISO timestamp
  updatedAt: Date; // ISO timestamp
}

export interface CustomerInterface {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  country: string;
  sessionId: string;
  siteId: string;
  userAgent: string | null;
  session: SessionInterface;
}
