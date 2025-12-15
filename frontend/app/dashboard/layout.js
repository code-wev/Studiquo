import Provider from "@/provider/Provider";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <Provider>
      <Toaster />
      <div className="flex">
        <section>
          <Sidebar />
        </section>
        
        <section className="flex-1">
          <Topbar />
          {children}
        </section>
      </div>
    </Provider>
  );
}