import SidebarWithHeader from "@/libs/Layouts/Dashboard";
import SessionRow from "@/libs/Components/LiveMonitoring/SessionRow";
import useCustomerLiveTrackingStore from "@/store/customerLiveTrackingStore";
import { Box, Heading, Image } from "@chakra-ui/react";

const LiveMonitoring = () => {
  const { customers } = useCustomerLiveTrackingStore();

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
              // key={customer.session.ip}
            />
          );
        })}
      </div>
    </SidebarWithHeader>
  );
};

export default LiveMonitoring;
