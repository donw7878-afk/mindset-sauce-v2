import { NextResponse } from "next/server";
import { requireBuilder } from "@/lib/vault-session";
import { archiveDoc } from "@/lib/tracks";
import { getVaultState } from "@/lib/vault";
import { signedStorageUrl, streamLocalFile } from "@/lib/media";

export const runtime = "nodejs";

/** The Archive's door. The Certificate template stays sealed until 24/24. */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const builder = await requireBuilder();
  if (!builder) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await params;
  const doc = archiveDoc(slug);
  if (!doc) return NextResponse.json({ error: "unknown document" }, { status: 404 });

  if (doc.certificate) {
    const state = await getVaultState(builder);
    if (!state.certificateUnlocked) {
      return NextResponse.json(
        { error: "The Certificate unlocks at 24 of 24 chapters." },
        { status: 403 }
      );
    }
  }

  const signed = await signedStorageUrl("archive", doc.object);
  if (signed) return NextResponse.redirect(signed, 307);

  if (!doc.file) return NextResponse.json({ error: "not yet in the archive" }, { status: 404 });
  return streamLocalFile(
    doc.file,
    req.headers.get("range"),
    "application/pdf",
    `inline; filename="${doc.slug}.pdf"`
  );
}
