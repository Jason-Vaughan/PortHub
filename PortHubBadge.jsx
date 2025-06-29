import React, { useEffect, useState } from "react";

const taglines = [
  "Claim Your Port Before Someone Else Does",
  "Bind Fast. Bind Often.",
  "Where Every Port Gets Action",
  "The Only Hub You Don't Have to Clear Your History For",
  "No Conflicts. Just Connections.",
  "Ports So Open, It's Almost Insecure",
  "We Keep It Clean. Your Services Won't.",
  "Come for the Ports. Stay for the Logs.",
  "One Registry to Rule Your Runtime"
];

export default function PortHubBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % taglines.length);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white px-4 py-3 rounded-xl shadow-lg w-fit max-w-full">
      <div className="flex items-center space-x-3">
        <div className="text-2xl font-bold">
          <span className="text-white">Port</span>
          <span className="bg-orange-500 px-1 rounded text-black">Hub</span>
        </div>
      </div>
      <p className="text-sm text-gray-300 italic mt-1 whitespace-nowrap">{taglines[index]}</p>
    </div>
  );
} 