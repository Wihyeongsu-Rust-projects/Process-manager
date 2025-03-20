"use client";

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface ProcessInfo {
  id: string;
  name: string;
}

const App = () => {
  const [osName, setOsName] = useState<string>("");
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  useEffect(() => {
    async function fetchData() {
      const os = await invoke<string>("os_name");
      const processList = await invoke<ProcessInfo[]>("list_process");

      setOsName(os);
      setProcesses(processList);
    }

    fetchData();
  }, []);

  async function deleteProcess(id: string) {
    const success = await invoke<boolean>("kill_by_id", { id });

    if (success) {
      setProcesses((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-5 font-sans">
      <h2 className="text-center text-gray-50">Operation System: {osName}</h2>
      <div className="mt-5">
        {processes.map((process) => (
          <div
            key={process.id}
            className="flex justify-between items-center p-2.5 border border-gray-300 rounded-md mb-2.5 bg-gray-50"
          >
            <span className="text-base text-gray-800">
              {process.name} (ID: {process.id})
            </span>
            <button
              onClick={() => deleteProcess(process.id)}
              className="py-1.5 px-2.5 bg-red-500 text-white border-none rounded-md cursor-pointer hover:bg-red-600"
            >
              Kill
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default App;
