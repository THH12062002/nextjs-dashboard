"use client";

import React, { useState } from "react";

const mockData = [
  {
    id: 1,
    name: "Msg_TX_01_XXX",
    value: 1000,
    position: 0,
    status: "ON",
    type: "SEND",
    canId: "123H",
    length: 6,
    dataRaw: "14 11 22 AA 00 BB 77 33 99",
    cycleTime: 20,
  },
  {
    id: 2,
    name: "Msg_RX_02_XXX",
    value: 500,
    position: 0,
    status: "ON",
    type: "RECEIVE",
    canId: "111H",
    length: 6,
    dataRaw: "46 11 22 77 AA 78 88 00 00",
    cycleTime: 100,
  },
  {
    id: 3,
    name: "Msg_TX_02_XXX",
    value: 800,
    position: 1,
    status: "ON",
    type: "SEND",
    canId: "512H",
    length: 7,
    dataRaw: "00 11 22 45 65 68 CC 89 13",
    cycleTime: 500,
  },
  {
    id: 4,
    name: "Msg_TX_03_XXX",
    value: 9000,
    position: 0,
    status: "OFF",
    type: "SEND",
    canId: "889H",
    length: 8,
    dataRaw: "14 11 22 AA 00 BB 22 33 77",
    cycleTime: 200,
  },
  {
    id: 5,
    name: "Msg_RX_04_XXX",
    value: 2,
    position: 1,
    status: "OFF",
    type: "RECEIVE",
    canId: "789H",
    length: 2,
    dataRaw: "00 11 22 00 00 00 00 00 00",
    cycleTime: 10,
  },
  {
    id: 6,
    name: "Msg_TX_07_XXX",
    value: 1,
    position: 1,
    status: "ON",
    type: "SEND",
    canId: "345H",
    length: 1,
    dataRaw: "00 11 00 00 00 00 00 00 00",
    cycleTime: 5,
  },
];

export default function CommunicationsTable() {
  const [data, setData] = useState(mockData);

  const handleTypeToggle = (id: number) => {
    setData((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? { ...msg, type: msg.type === "SEND" ? "RECEIVE" : "SEND" }
          : msg
      )
    );
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium">Name</th>
                <th className="px-3 py-5 font-medium text-center">Value</th>
                <th className="px-3 py-5 font-medium text-center">Position</th>
                <th className="px-3 py-5 font-medium text-center">Status</th>
                <th className="px-3 py-5 font-medium text-center">Type</th>
                <th className="px-3 py-5 font-medium text-center">CAN ID</th>
                <th className="px-3 py-5 font-medium text-center">Length</th>
                <th className="px-3 py-5 font-medium">Data Raw</th>
                <th className="px-3 py-5 font-medium text-center">
                  Cycle Time
                </th>
                <th className="py-3 pl-6 pr-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((msg) => (
                <tr
                  key={msg.id}
                  className="border-b text-sm last-of-type:border-none"
                >
                  <td className="py-3 pl-6 pr-3">{msg.name}</td>
                  <td className="px-3 py-3 text-center">{msg.value}</td>
                  <td className="px-3 py-3 text-center">{msg.position}</td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        msg.status === "ON" ? "bg-green-500" : "bg-orange-400"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 bg-gray-100 text-center">
                    {msg.type}
                  </td>
                  <td className="px-3 py-3 text-center">{msg.canId}</td>
                  <td className="px-3 py-3 text-center">{msg.length}</td>
                  <td className="px-3 py-3 bg-gray-100">{msg.dataRaw}</td>
                  <td className="px-3 py-3 text-center">{msg.cycleTime}</td>
                  <td className="py-3 pl-6 pr-3 text-center">
                    <input
                      type="checkbox"
                      className="mr-2 align-middle"
                      checked={msg.type === "SEND"}
                      onChange={() => handleTypeToggle(msg.id)}
                      title="Toggle SEND/RECEIVE"
                    />
                    <button className="mr-2 text-blue-600 hover:underline">
                      ✏️
                    </button>
                    <button className="text-red-600 hover:underline">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
