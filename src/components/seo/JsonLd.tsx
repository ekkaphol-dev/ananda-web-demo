import { PROJECTS_K, type ProjectKnowledge } from "@/services/knowledge";
import { SITE } from "@/utils/site";

// Structured data (schema.org) ให้ Google และ AI เข้าใจว่าเว็บนี้คืออะไร และมีโครงการอะไรบ้าง
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const ORG_ID = `${SITE.url}/#org`;
const org = { "@type": "Organization", "@id": ORG_ID, name: "Ananda Development", alternateName: "อนันดา ดีเวลลอปเม้นท์", url: "https://www.ananda.co.th" };

/** ApartmentComplex ของแต่ละโครงการ (ใช้ทั้งหน้าแรกและหน้าโครงการ) */
export function apartmentLd(p: ProjectKnowledge) {
  const url = `${SITE.url}/projects/${p.slug}`;
  return {
    "@type": "ApartmentComplex",
    "@id": `${url}#project`,
    name: p.name,
    url,
    sameAs: p.officialUrl,
    description: p.summary,
    ...(p.units ? { numberOfAccommodationUnits: p.units } : {}),
    address: { "@type": "PostalAddress", ...(p.address ? { streetAddress: p.address } : {}), addressLocality: "กรุงเทพมหานคร", addressCountry: "TH" },
    amenityFeature: p.highlights
      .filter((h) => h.status === "verified")
      .map((h) => ({ "@type": "LocationFeatureSpecification", name: h.text, value: true })),
    petsAllowed: false,
    containedInPlace: { "@type": "Place", name: p.area },
    brand: { "@id": ORG_ID },
  };
}

export function HomeJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          org,
          {
            "@type": "WebSite",
            "@id": `${SITE.url}/#website`,
            url: SITE.url,
            name: SITE.name,
            description: SITE.description,
            inLanguage: "th-TH",
            publisher: { "@id": ORG_ID },
          },
          {
            "@type": "ItemList",
            name: "4 โครงการในแคมเปญ",
            itemListElement: PROJECTS_K.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: apartmentLd(p) })),
          },
        ],
      }}
    />
  );
}

export function ProjectJsonLd({ p }: { p: ProjectKnowledge }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          org,
          apartmentLd(p),
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "หน้าหลัก", item: SITE.url },
              { "@type": "ListItem", position: 2, name: p.name, item: `${SITE.url}/projects/${p.slug}` },
            ],
          },
        ],
      }}
    />
  );
}
