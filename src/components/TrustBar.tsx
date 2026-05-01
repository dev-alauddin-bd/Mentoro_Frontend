"use client"

import { useTranslation } from "react-i18next";
import { Section } from "./ui/section";

export function TrustBar() {
  const { t } = useTranslation();
  
  // Placeholder logos for reputable companies
  const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  ];

  return (
    <Section className="bg-card/40" containerClassName="space-y-10">
      <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">
        {t("extra.trust_title")}
      </p>
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 transition-all duration-700">
        {companies.map((company) => (
          <img 
            key={company.name} 
            src={company.logo} 
            alt={company.name} 
            className="h-6 md:h-8 w-auto object-contain cursor-pointer transition-transform hover:scale-110 grayscale hover:grayscale-0 opacity-50 hover:opacity-100" 
          />
        ))}
      </div>
    </Section>
  );
}
