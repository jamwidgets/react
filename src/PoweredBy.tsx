import { createElement, useEffect, useState } from "react";
import { fetchSiteConfig, POWERED_BY_URL, resolveConfig } from "@jamwidgets/core";

export interface PoweredByProps {
  /** Site key - optional if <meta name="jamwidgets-site-key"> is set */
  siteKey?: string;
  endpoint?: string;
  className?: string;
}

/**
 * True when the site's plan requires the "Powered by Jamwidgets" footer.
 * Stays false until `/api/v1/site` answers, and on any failure, so a paying
 * site is never branded.
 */
export function usePoweredBy(options: Omit<PoweredByProps, "className"> = {}): boolean {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let config;
    try {
      config = resolveConfig(options);
    } catch {
      return;
    }
    let active = true;
    void fetchSiteConfig(config).then((site) => {
      if (active) setShow(site?.showPoweredBy === true);
    });
    return () => {
      active = false;
    };
  }, [options.siteKey, options.endpoint]);
  return show;
}

/**
 * The "Powered by Jamwidgets" footer. The hooks render no UI, so Free sites
 * must place this under the widgets they build; it renders nothing on Team.
 */
export function PoweredBy(props: PoweredByProps) {
  const show = usePoweredBy(props);
  if (!show) return null;
  return createElement(
    "div",
    { className: ["jamwidgets-powered-by", props.className].filter(Boolean).join(" ") },
    createElement("a", { href: POWERED_BY_URL, target: "_blank", rel: "noopener noreferrer" }, "Powered by Jamwidgets"),
  );
}
