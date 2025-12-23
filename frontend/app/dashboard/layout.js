import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import Provider from "@/provider/AllProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <Provider>
      <Toaster />
      <div className='flex h-screen'>
        {/* Sidebar */}
        <section className='h-screen'>
          <Sidebar />
        </section>

        {/* Main Content  */}
        <section className='flex-1 flex flex-col h-screen overflow-hidden'>
          <div className='shrink-0'>
            <Topbar />
          </div>
          <div className='flex-1 overflow-y-auto'>{children}</div>
        </section>
      </div>
    </Provider>
  );
}
