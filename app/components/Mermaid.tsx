"use client";

import React, { useEffect, useState, useId } from "react";
import mermaid from "mermaid";

// Initialize Mermaid with broader text color settings
mermaid.initialize({
  startOnLoad: false,
  // 1. Force the dark theme, which often sets text to light by default
  theme: "dark", 
  securityLevel: "loose",
});

export default function Mermaid({ chart }: { chart: string }) {
  const id = `mermaid-${useId().replace(/:/g, "")}`;
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        const { svg: generatedSvg } = await mermaid.render(id, chart);
        if (isMounted) {
          setSvg(generatedSvg);
        }
      } catch (error) {
        console.error("Mermaid parsing failed:", error);
      }
    };

    if (chart) {
      renderChart();
    }

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  if (!svg) {
    return (
      <div className="flex justify-center p-10 text-sm text-gray-500 animate-pulse">
        Rendering diagram...
      </div>
    );
  }

  return (
    <div 
      // 2. Add a special class 'mermaid-diagram-container' here for CSS targeting
      className="flex justify-center my-8 overflow-x-auto w-full mermaid-diagram-container"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}