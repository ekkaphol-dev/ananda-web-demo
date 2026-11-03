import type { MetadataRoute } from "next";
import { DATA_DATE, PROJECTS_K } from "@/services/knowledge";
import { INDEXABLE, SITE } from "@/utils/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = INDEXABLE.map((p) => ({
    url: `${SITE.url}${p.path === "/" ? "" : p.path}`,
    changeFrequency: "weekly",
    priority: p.priority,
  }));
  const projects: MetadataRoute.Sitemap = PROJECTS_K.map((p) => ({
    url: `${SITE.url}/projects/${p.slug}`,
    lastModified: DATA_DATE || undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...pages, ...projects];
}
