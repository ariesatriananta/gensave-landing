import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Heart, CheckCircle, ArrowLeft, ArrowBigDown, ArrowDown } from "lucide-react"

const BTN_PRIMARY =
  "bg-[#FFA052] hover:bg-orange-500 text-white shadow-sm " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"

const BTN_OUTLINE =
  "border-orange-200 text-orange-500 hover:bg-orange-100 hover:text-[#FFA052] border-[#FFA052]"

export default function SuccessPage({
    searchParams,
  }: {
    searchParams: { txt?: string; json?: string; file?: string; offline?: string };
  }) {
  const { txt, json, file, offline } = searchParams || {};
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
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center py-3">
                {/* Tombol Download TXT */}
                {txt ? (
                  <Button className="bg-[#FFA052] hover:bg-orange-500">
                    <a href={txt} target="_blank" rel="noopener" className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4" />
                      Unduh Hasil{file ? ` (${file})` : ""}
                    </a>
                  </Button>
                ) : (
                  <Button disabled className="opacity-60" > <ArrowDown className="h-6 w-6" />Unduh Hasil</Button>
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
