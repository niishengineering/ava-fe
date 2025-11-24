import SidebarWithHeader from "@/libs/Layouts/Dashboard";
import SessionRow from "@/libs/Components/LiveMonitoring/SessionRow";
import useCustomerLiveTrackingStore from "@/store/customerLiveTrackingStore";
import { Box, Heading, Image } from "@chakra-ui/react";
import PageHistory from "@/libs/Components/LiveMonitoring/PageHistory";
import { useState } from "react";

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

const LiveMonitoring = () => {
  const { customers } = useCustomerLiveTrackingStore();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>();

  return (
    <SidebarWithHeader title="Live Monitoring">
      <div className="py-6">
        {customers && customers?.length === 0 && (
          <Box
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            mt={"5rem"}
          >
            <Box>
              <Image src="/emptyChatAndTicket.svg" />
            </Box>
            <Heading color={"black"} fontWeight={"500"}>
              {" "}
              No Customers On Your Site{" "}
            </Heading>
          </Box>
        )}

        {customers.map((customer) => {
          return (
            <SessionRow
              name={customer.name || "N/A"}
              countryCode={customer.session.country}
              ipAddress={customer.session.ip}
              currentPage={customer.currentUrl || "N/A"}
              browser={customer.session.browser || "N/A"}
              os={customer.session.os || "N/A"}
              visits={customer.session.totalWebSessions}
              chats={customer.session.totalLiveChats}
              key={customer.session.ip}
              onViewHistory={() => {
                console.log(customer);
                setSelectedCustomer(customer);
              }}
            />
          );
        })}

        {selectedCustomer && (
          <PageHistory
            userName={selectedCustomer.name as string}
            userAvatar={selectedCustomer.name as string}
            customerId={selectedCustomer.id as string}
            visits={[]}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </SidebarWithHeader>
  );
};

export default LiveMonitoring;
