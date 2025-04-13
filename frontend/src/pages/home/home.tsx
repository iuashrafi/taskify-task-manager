import { AppSidebar } from "@/components/blocks/app-sidebar";
import { ChartAreaInteractive } from "@/components/blocks/chart-area-interactive";
import { DataTable } from "@/components/blocks/data-table";
import { SectionCards } from "@/components/blocks/section-cards";
import { SiteHeader } from "@/components/blocks/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Project name" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
