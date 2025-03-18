import Form from "@/app/danmay_2503/frontend/ui/invoices/create-form";
import Breadcrumbs from "@/app/danmay_2503/frontend/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/danmay_2503/frontend/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Invoice",
};

export default async function Page() {
  const customers = await fetchCustomers();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Create Invoice",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
