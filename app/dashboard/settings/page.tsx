"use client";
import { useState } from "react";
import { Metadata } from "next";

export default function Page() {
  const [comEnabled, setComEnabled] = useState(false);
  const [canEnabled, setCanEnabled] = useState(false);
  const [port, setPort] = useState("COM19");
  const [clock, setClock] = useState("8MHz");
  const [bitRate, setBitRate] = useState("500");

  const ports = Array.from({ length: 10 }, (_, i) => `COM${i + 1}`);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Setting</h1>
      <div className="mb-6 flex items-center">
        <span className="mr-2 text-xl">⬜</span>
        <label htmlFor="com-setting" className="font-semibold text-lg">
          COM Port Setting:
        </label>
      </div>
      <div className="mb-8 ml-8">
        <label className="mr-2">Port:</label>
        <select
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="border rounded px-2 py-1 bg-gray-100 w-32"
        >
          {ports.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6 flex items-center">
        <span className="mr-2 text-xl">⬜</span>
        <label htmlFor="can-setting" className="font-semibold text-lg">
          CAN Setting:
        </label>
      </div>
      <div className="ml-8 flex flex-col gap-4 w-64">
        <div className="flex items-center">
          <label className="mr-2 w-32">Clock Frequency:</label>
          <select
            value={clock}
            onChange={(e) => setClock(e.target.value)}
            className="border rounded px-2 py-1 bg-gray-100 w-24"
          >
            <option value="8MHz">8MHz</option>
            <option value="16MHz">16MHz</option>
            <option value="20MHz">20MHz</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="mr-2 w-32">Bit Rate [Kbit/s]:</label>
          <select
            value={bitRate}
            onChange={(e) => setBitRate(e.target.value)}
            className="border rounded px-2 py-1 bg-gray-100 w-24"
          >
            <option value="125">125</option>
            <option value="250">250</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
        </div>
      </div>
    </div>
  );
}
