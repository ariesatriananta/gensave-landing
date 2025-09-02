"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Heart, CheckCircle, ArrowLeft, ArrowDownToLine, FileJson, ArrowDown } from "lucide-react";


type Payload = {
  createdAt: string;
  profile: {
    nama: string; jenisKelamin: string; tempatLahir: string; tanggalLahir: string;
    umur: string; tinggiBadan: string; beratBadan: string; alamat: string;
  };
  answers: Record<string, any>;
  results: { items: { key: string; val: number }[]; overall: number };
};

const BTN_PRIMARY =
  "bg-[#FFA052] hover:bg-orange-500 text-white shadow-sm " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"

const BTN_OUTLINE =
  "border-orange-200 text-orange-500 hover:bg-orange-100 hover:text-[#FFA052] border-[#FFA052]"


export default function SuccessPage() {

  const [txtHref, setTxtHref] = useState<string | null>(null);
  const [jsonHref, setJsonHref] = useState<string | null>(null);
  const [baseName, setBaseName] = useState("gensave_screening");
  const [data, setData] = useState<Payload | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem("gensave:latest") : null;
    if (!raw) return;

    try {
      const parsed: Payload = JSON.parse(raw);
      setData(parsed);

      const clean = (parsed?.profile?.nama || "user")
        .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
      const stamp = (parsed?.createdAt || new Date().toISOString()).replace(/[:.]/g, "-");
      const base = `${clean}_${stamp}`;
      setBaseName(base);

      // buat TXT dari payload (tanpa request ke server)
      const txt = toTxt(parsed);
      const txtUrl = URL.createObjectURL(new Blob([txt], { type: "text/plain;charset=utf-8" }));
      setTxtHref(txtUrl);

      // buat JSON dari payload
      const jsonUrl = URL.createObjectURL(
        new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" })
      );
      setJsonHref(jsonUrl);

      return () => {
        URL.revokeObjectURL(txtUrl);
        URL.revokeObjectURL(jsonUrl);
      };
    } catch (e) {
      console.warn("failed to parse session payload", e);
    }
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 grid grid-cols-3 items-center">
          {/* Kiri: Kembali */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Kembali</span>
            </Link>
          </div>

          {/* Tengah: Brand */}
          <div className="flex justify-center items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">GenSave</span>
          </div>

          {/* Kanan: Theme toggle */}
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Success Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card
            className="rounded-2xl border border-border/80 bg-card/90 shadow-md backdrop-blur-sm
                       supports-[backdrop-filter]:bg-card/80 dark:supports-[backdrop-filter]:bg-card/60 text-center"
          >
            <CardHeader className="pb-2">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full
                              bg-orange-100 text-[#FFA052] ring-1 ring-orange-200
                              dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-900/50">
                <CheckCircle className="h-9 w-9" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-semibold">Data Berhasil Dikirim!</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 md:space-y-6">
              <p className="text-base text-muted-foreground">
                Terima kasih telah melakukan screening genetik. Data Anda tersimpan dengan aman.
              </p>
              <p className="text-sm text-muted-foreground">
                Tim kami akan meninjau dan, bila diperlukan, menghubungi Anda untuk langkah selanjutnya.
              </p>

              {/* Ringkas info */}
              {data && (
                <div className="mt-8 text-center text-sm text-muted-foreground">
                  <p><b>Nama:</b> {data.profile.nama}</p>
                  <p><b>Tanggal:</b> {new Date(data.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}</p>
                </div>
              )}
              
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center py-3">
                {/* Tombol Download TXT */}
                {txtHref ? (
                    <Button className="bg-[#FFA052] hover:bg-orange-500" asChild>
                      <a href={txtHref} download={`${baseName}.txt`} className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4" />
                        Unduh Hasil Screening
                      </a>
                    </Button>
                  ) : (
                    <Button disabled className="opacity-60">
                      <ArrowDown className="h-4 w-4" />
                      Unduh Hasil Screening
                    </Button>
                  )}
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Link href="/">
                  <Button variant="outline" className={BTN_OUTLINE}>
                    Kembali ke Beranda
                  </Button>
                </Link>
                <Link href="/screening">
                  <Button className={BTN_PRIMARY}>Screening Lagi</Button>
                </Link>
              </div>
              

              {/* catatan kecil agar konsisten dengan halaman hasil */}
              <blockquote
                className="mt-6 rounded-lg border p-4 text-xs leading-relaxed
                           bg-orange-50 text-orange-800 border-orange-200
                           dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900"
              >
                Hasil pada aplikasi ini merupakan screening awal, bukan diagnosis medis.
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


// ===== helper: format TXT dari payload form (client-side) =====
function toTxt(p: Payload) {
  const tgl = new Date(p.createdAt).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const lines: string[] = [];
  lines.push("HASIL SCREENING GENETIK GENSAVE");
  lines.push("================================");
  lines.push("");
  lines.push("Data Pribadi:");
  lines.push(`- Nama Lengkap : ${p.profile.nama}`);
  lines.push(`- Jenis Kelamin: ${p.profile.jenisKelamin}`);
  lines.push(`- Tempat Lahir : ${p.profile.tempatLahir}`);
  lines.push(`- Tanggal Lahir: ${p.profile.tanggalLahir}`);
  lines.push(`- Umur         : ${p.profile.umur} tahun`);
  lines.push(`- Tinggi Badan : ${p.profile.tinggiBadan} cm`);
  lines.push(`- Berat Badan  : ${p.profile.beratBadan} kg`);
  lines.push(`- Alamat       : ${p.profile.alamat}`);
  lines.push("");
  lines.push("Ringkasan Skor per Penyakit:");
  p.results.items.forEach(it => lines.push(`- ${it.key}: ${it.val}%`));
  lines.push("");
  lines.push(`Rata-rata keseluruhan: ${p.results.overall}%`);
  lines.push("");
  lines.push(`Waktu Screening: ${tgl}`);
  lines.push("");
  lines.push("================================");
  lines.push("Data ini bersifat rahasia dan hanya untuk keperluan medis.");
  return lines.join("\n");
}