"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import styles from "./VaultNav.module.css";

/**
 * Authenticated navigation, spec §8: glass bar, links center, Builder
 * identity + Score right. The score is server-rendered per request and
 * refreshes with the route.
 */
export default function VaultNav({
  name,
  builderNumber,
  score,
  currentModule,
}: {
  name: string;
  builderNumber: string | null;
  score: number;
  currentModule: number;
}) {
  const pathname = usePathname();
  const links = [
    { href: "/vault", label: "Dashboard", exact: true },
    { href: `/vault/modules/${currentModule}`, label: "Chambers", match: "/vault/modules" },
    { href: "/vault/audio", label: "Audio" },
    { href: "/vault/resources", label: "The Archive", match: "/vault/resources" },
  ];

  const initial = (name.trim()[0] ?? "B").toUpperCase();

  return (
    <header className={styles.nav}>
      <Link href="/vault" className={styles.logo} aria-label="The Mindset Sauce Institute — Dashboard">
        <Image src="/images/logo.png" alt="" width={36} height={36} className={styles.logoMark} />
        <span className={styles.logoText}>The Institute</span>
      </Link>

      <nav className={styles.links} aria-label="Builder Portal">
        {links.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname.startsWith(l.match ?? l.href);
          return (
            <Link
              key={l.label}
              href={l.href}
              className={`${styles.link} ${active ? styles.active : ""}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.identity}>
        <span className={styles.score} title="Builder Score">
          {score.toLocaleString("en-US")}
        </span>
        <span className={styles.avatar} title={builderNumber ?? name} aria-hidden>
          {initial}
        </span>
        <button
          className={styles.signOut}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
