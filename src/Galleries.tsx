"use client";

// The client boundary makes the custom-element registration run in the browser.
import "@jamwidgets/core/gallery-elements";
import { createElement } from "react";

export interface GalleryProps {
  siteKey: string;
  slug: string;
  endpoint?: string;
  tag?: string;
}

export function Gallery(props: GalleryProps) {
  return createElement("jamwidgets-gallery", {
    "site-key": props.siteKey,
    slug: props.slug,
    endpoint: props.endpoint,
    tag: props.tag,
  });
}

export interface GalleryIndexProps {
  siteKey: string;
  endpoint?: string;
  deepLink?: boolean;
}

export function GalleryIndex(props: GalleryIndexProps) {
  return createElement("jamwidgets-gallery-index", {
    "site-key": props.siteKey,
    endpoint: props.endpoint,
    "deep-link": props.deepLink ? "" : undefined,
  });
}

export interface RandomPhotoProps extends GalleryProps {
  seed?: string;
}

export function RandomPhoto(props: RandomPhotoProps) {
  return createElement("jamwidgets-random-photo", {
    "site-key": props.siteKey,
    slug: props.slug,
    endpoint: props.endpoint,
    tag: props.tag,
    seed: props.seed,
  });
}
