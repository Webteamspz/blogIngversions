"use client";

import { useEffect, useState, useId } from "react";
import mermaid from "mermaid";

// Initialize Mermaid to match the Playful Geometric (light) theme
mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose",
  themeVariables: {
    background: "#ffffff",
    primaryColor: "#a78bfa",
    primaryTextColor: "#1e293b",
    primaryBorderColor: "#1e293b",
    lineColor: "#1e293b",
    secondaryColor: "#f472b6",
    tertiaryColor: "#fbbf24",
    fontFamily: "var(--font-plus-jakarta), sans-serif",
  },
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