import Form from "@/app/danmay_2503/frontend/ui/invoices/edit-form";
import Breadcrumbs from "@/app/danmay_2503/frontend/ui/invoices/breadcrumbs";
import {
  fetchCustomers,
  fetchInvoiceById,
} from "@/app/danmay_2503/frontend/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    return notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
