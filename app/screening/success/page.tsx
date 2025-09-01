import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Heart, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">GenSave</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Success Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Data Berhasil Dikirim!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Terima kasih telah melakukan screening genetik. Data Anda telah tersimpan dengan aman dan akan diproses
                oleh tim medis kami.
              </p>
              <p className="text-muted-foreground mb-8">
                Kami akan menghubungi Anda dalam 2-3 hari kerja untuk memberikan hasil screening dan konsultasi lebih
                lanjut jika diperlukan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Beranda
                  </Button>
                </Link>
                <Link href="/screening">
                  <Button>Screening Lagi</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
