"use client";

import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";
import articleStyles from "../[slug]/ArticleDetail.module.css";

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

/* ---------- linear-flow parser: mermaid `graph`/`flowchart` -> ordered step labels ---------- */

function parseFlowSteps(src: string): string[] | null {
  const lines = src.split(/\r?\n/).map((l) => l.trim());
  if (!/^(graph|flowchart)\s/i.test(lines[0] || "")) return null;

  const labels = new Map<string, string>();
  const order: string[] = [];

  const addNode = (raw: string) => {
    const token = raw.trim().replace(/^\|[^|]*\|/, "").trim(); // drop leading edge label
    if (!token) return;
    const shaped = token.match(/^([\w.-]+)\s*[[({]+\s*"?(.*?)"?\s*[\])}]+\s*$/);
    const bare = token.match(/^([\w.-]+)$/);
    const id = shaped ? shaped[1] : bare ? bare[1] : null;
    if (!id) return;
    const label = shaped
      ? shaped[2].replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim()
      : "";
    if (!labels.has(id)) {
      labels.set(id, label || id);
      order.push(id);
    } else if (label && labels.get(id) === id) {
      labels.set(id, label);
    }
  };

  for (const line of lines) {
    if (
      !line ||
      line.startsWith("%%") ||
      /^(graph|flowchart|subgraph|end|style|classDef|class|linkStyle|direction)\b/i.test(line)
    )
      continue;
    if (!/--+>?|==+>?|-\.-+>?/.test(line)) continue;
    const parts = line.split(/\s*(?:--+>?|==+>?|-\.-+>?)\s*/).filter(Boolean);
    if (parts.length < 2) continue;
    parts.forEach(addNode);
  }

  const steps = order.map((id) => labels.get(id) || id);
  return steps.length >= 2 ? steps : null;
}

/* ---------- vertical step timeline ---------- */

function FlowSteps({ steps }: { steps: string[] }) {
  return (
    <ol className={articleStyles["flow-steps"]}>
      {steps.map((label, i) => (
        <li key={i} className={articleStyles["flow-steps-item"]}>
          <span className={articleStyles["flow-steps-num"]}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className={articleStyles["flow-steps-card"]}>{label}</div>
        </li>
      ))}
    </ol>
  );
}

export default function Mermaid({ chart }: { chart: string }) {
  const id = `mermaid-${useId().replace(/:/g, "")}`;
  const [svg, setSvg] = useState<string>("");

  const flowSteps = parseFlowSteps(chart);

  useEffect(() => {
    if (flowSteps) return;
    let isMounted = true;
    const renderChart = async () => {
      try {
        const { svg: generatedSvg } = await mermaid.render(id, chart);
        if (isMounted) setSvg(generatedSvg);
      } catch (error) {
        console.error("Mermaid parsing failed:", error);
      }
    };
    if (chart) renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart, id, flowSteps]);

  if (flowSteps) return <FlowSteps steps={flowSteps} />;

  if (!svg) {
    return (
      <div className="flex justify-center p-10 text-sm text-gray-500 animate-pulse">
        Rendering diagram...
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center my-8 overflow-x-auto w-full ${articleStyles["mermaid-diagram-container"]}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
