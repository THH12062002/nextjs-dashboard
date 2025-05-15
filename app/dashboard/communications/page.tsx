import CommunicationsTable from "@/app/ui/communications/table";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CAN Communication",
};

export default function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>CAN Communication</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search messages..." />
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Create Message +
        </button>
      </div>
      <CommunicationsTable />
    </div>
  );
}
