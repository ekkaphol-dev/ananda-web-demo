import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS_K, projectBySlug } from "@/services/knowledge";
import { pageMeta } from "@/utils/site";
import { ProjectView } from "@/views/ProjectView";

// หน้าโครงการสร้างเป็น HTML static ตอน build ทั้ง 4 หน้า
export function generateStaticParams() {
  return PROJECTS_K.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const p = projectBySlug((await params).slug);
  if (!p) return {};
  const transit = p.transit[0] ? ` ใกล้ ${p.transit[0].station} ${p.transit[0].distance}` : "";
  return pageMeta({
    title: `${p.name} คอนโดให้เช่าและลงทุน${transit}`,
    description: `${p.name}${transit} · ${p.summary}`.slice(0, 300),
    path: `/projects/${p.slug}`,
  });
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const p = projectBySlug((await params).slug);
  if (!p) notFound();
  return <ProjectView p={p} />;
}
