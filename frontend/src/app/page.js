"use client"
import { useState } from "react"

import AquaStatistics from "@/components/AquaStatistics/AquaStatistics";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import StakingForm from "@/components/StakingForm/StakingForm";

export default function Home() {
  const [totalPooledEther, setTotalPooledEther] = useState(0)

  return (
    <>
      <Header />
      <div className="h-fit py-24">
        <StakingForm />
        <AquaStatistics
          totalPooledEther={totalPooledEther}
          setTotalPooledEther={setTotalPooledEther} />
      </div>
      <Footer />
    </>
  );
}