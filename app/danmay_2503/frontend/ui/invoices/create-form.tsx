"use client";

import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/danmay_2503/frontend/ui/button";
import { createInvoice, State } from "@/app/danmay_2503/frontend/lib/actions";
import { useActionState } from "react";
import { useState } from "react";
import {
  CustomerField,
  InvoiceForm,
} from "@/app/danmay_2503/frontend/lib/definitions";
import { invoices } from "@/app/danmay_2503/frontend/lib/placeholder-data";

export default function Form({ customers }: { customers: CustomerField[] }) {
  const [uploadedInvoices, setUploadedInvoices] = useState<InvoiceForm[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      //Validate the JSON strcuture
      if (!Array.isArray(data)) {
        throw new Error("Invalid JSON format. Expected an array of invoices.");
      }

      const validInvoices = data.map((invoices: any) => {
        const customer = customers.find(
          (c) => c.name === invoices.customerName
        );
        if (!customer) {
          throw new Error(`Customer ${invoices.customerName} not found!`);
        }

        if (
          typeof invoices.amout !== "number" ||
          !["pending", "paid"].includes(invoices.status)
        ) {
          throw new Error("Invalid invoice data format");
        }

        return {
          id: crypto.randomUUID(),
          customer_id: customer.id,
          amount: invoices.amount,
          status: invoices.status,
        } as InvoiceForm;
      });

      setUploadedInvoices(validInvoices);
      console.log("Uploaded invoices", validInvoices);
    } catch (error) {
      console.error("Error parsing JSON file: ", error);
      alert("Failed to upload invoices. Please check the file format.");
    }
  };

  const handleSubmit = async () => {
    //Submit the invoices to the backend
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadedInvoices),
      });

      if (!response.ok) {
        throw new Error("Failed to submit invoices. Please try again.");
      }

      alert("Invoices submitted successfully!");
    } catch (error) {
      console.error("Error submitting invoices: ", error);
      alert("Failed to submit invoices. Please try again.");
    }
  };

  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createInvoice, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Add the JSON upload section */}
      <div>
        <h2 className="text-lg font-bold">Create Invoice</h2>
        <div className="mt-4">
          <label
            htmlFor="json-upload"
            className="block text-sm font-medium text-gray-700"
          >
            Import Invoices (JSON)
          </label>
          <input
            type="file"
            id="json-upload"
            accept=".json"
            onChange={handleFileUpload}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {uploadedInvoices.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-semibold">Uploaded Invoices:</h3>
            <ul className="mt-2 list-disc pl-5">
              {uploadedInvoices.map((invoice, index) => (
                <li key={index}>
                  Customer ID: {invoice.customer_id}, Amount: ${invoice.amount},
                  Status: {invoice.status}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Submit Invoices
        </button>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}
