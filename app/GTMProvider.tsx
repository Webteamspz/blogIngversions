"use client";

import { useEffect } from "react";
import { initGTMTracking } from "./gtm";

export default function GTMProvider() {

  useEffect(() => {
    initGTMTracking();
  }, []);

  return null;
}