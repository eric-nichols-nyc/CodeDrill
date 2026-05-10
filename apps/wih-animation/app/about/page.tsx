"use client";

import Nav from "@/components/nav";
import { PageWrapper } from "@/components/page-wrapper";

const About = () => (
  <PageWrapper>
    <Nav />
    <main className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      About page
    </main>
  </PageWrapper>
);

export default About;
