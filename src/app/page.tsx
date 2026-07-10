import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Threshold from "@/components/sections/Threshold";
import Mirror from "@/components/sections/Mirror";
import { MIRROR_BEATS, INTERLUDE_BEATS } from "@/lib/content";
import Institution from "@/components/sections/Institution";
import Chambers from "@/components/sections/Chambers";
import Combination from "@/components/sections/Combination";
import Unlocking from "@/components/sections/Unlocking";
import Inventory from "@/components/sections/Inventory";
import Builders from "@/components/sections/Builders";
import Ledger from "@/components/sections/Ledger";
import Decision from "@/components/sections/Decision";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Threshold />
        <Mirror beats={MIRROR_BEATS} />
        <Institution />
        <Mirror beats={INTERLUDE_BEATS} ariaLabel="Interlude" compact />
        <Chambers />
        <Combination />
        <Unlocking />
        <Inventory />
        <Builders />
        <Ledger />
        <Decision />
      </main>
      <Footer />
    </>
  );
}
