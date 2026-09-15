import type { Metadata } from "next";
import { GenerateWizard } from "@/components/generator/wizard";

export const metadata: Metadata = {
  title: "Generate Your YouTube Channel Kit",
  description: "Describe your YouTube channel idea and get a complete starter kit: names, branding, keywords, content pillars and 40 video ideas.",
};

export default function GeneratePage() {
  return (
    <div className="section py-12 sm:py-16">
      <GenerateWizard />
    </div>
  );
}
