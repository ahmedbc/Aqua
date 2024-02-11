"use client"
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import StakingForm from "@/components/StakingForm/StakingForm";

export default function Home() {
  return (
    <>
      <Header />
      <div className="h-fit py-24">
        <StakingForm />
      </div>
      <Footer />
    </>
  );
}