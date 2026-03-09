"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FocusAreas from "@/components/FocusAreas";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import InvestModal from "@/components/InvestModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main>
      <Navbar onInvestClick={() => setModalOpen(true)} />
      <Hero onInvestClick={() => setModalOpen(true)} />
      <About />
      <FocusAreas />
      <Portfolio />
      <Footer onInvestClick={() => setModalOpen(true)} />
      <InvestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
