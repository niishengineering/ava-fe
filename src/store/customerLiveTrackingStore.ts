import { create } from "zustand";
import { persist } from "zustand/middleware";

type Session = {
  id: string;
  customerId: string;
  firstSeen: string;
  lastSeen: string;
  country: string;
  city: string;
  region: string;
  ip: string;
  os: string;
  browser: string;
  firstWebSession: string | null;
  latestWebSession: string | null;
  totalWebSessions: number;
  pageViews: number;
  timeSpentMinutes: number;
  firstLiveChat: string | null;
  latestLiveChat: string | null;
  totalLiveChats: number;
  createdAt: string;
  updatedAt: string;
};

type Customer = {
  id: string;
  sessionId: string | null;
  chatSessionId: string;
  siteId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  userAgent: string | null;
  country: string;
  session: Session;
  currentUrl: string;
};

type Store = {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  replaceCustomer: (customer: Customer) => void;
  setCustomers: (customers: Customer[]) => void;
  upsertCustomer: (customer: Customer) => void; // <-- new function
};

const useCustomerLiveTrackingStore = create<Store>()(
  persist(
    (set) => ({
      customers: [],

      addCustomer: (customer) =>
        set((state) => ({
          customers: [...state.customers, customer],
        })),

      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        })),

      replaceCustomer: (customer) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === customer.id ? customer : c
          ),
        })),

      setCustomers: (customers) => set({ customers }),

      upsertCustomer: (customer) =>
        set((state) => {
          const exists = state.customers.some((c) => c.id === customer.id);
          return {
            customers: exists
              ? state.customers.map((c) =>
                  c.id === customer.id ? customer : c
                )
              : [...state.customers, customer],
          };
        }),
    }),
    {
      name: "customer-tracking-storage", // key in localStorage
    }
  )
);

export default useCustomerLiveTrackingStore;
