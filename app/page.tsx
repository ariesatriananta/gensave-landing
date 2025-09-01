import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Heart, Shield, Users, CheckCircle, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">GenSave</span>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <Link href="#beranda" className="text-muted-foreground hover:text-primary transition-colors">
                Beranda
              </Link>
              <Link href="#manfaat" className="text-muted-foreground hover:text-primary transition-colors">
                Manfaat
              </Link>
              <Link href="#tentang" className="text-muted-foreground hover:text-primary transition-colors">
                Tentang
              </Link>
              <Link href="#kontak" className="text-muted-foreground hover:text-primary transition-colors">
                Kontak
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="beranda" className="py-20 bg-gradient-to-br from-secondary/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Persiapkan Masa Depan Keluarga yang Lebih Sehat
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              GenSave membantu Anda melakukan screening genetik pranikah untuk memastikan kesehatan generasi mendatang.
              Mudah, aman, dan terpercaya.
            </p>
            <Link href="/screening">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full">
                Mulai Screening
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Genetic Screening Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Mengapa Screening Genetik Penting?</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Screening genetik sebelum menikah membantu mengidentifikasi risiko penyakit keturunan dan memberikan
              informasi penting untuk perencanaan keluarga yang lebih baik.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Deteksi Dini</h3>
                <p className="text-muted-foreground">
                  Mengidentifikasi risiko penyakit genetik seperti thalasemia sebelum merencanakan kehamilan
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Konseling Genetik</h3>
                <p className="text-muted-foreground">
                  Mendapatkan panduan dari ahli genetik untuk memahami hasil screening dan langkah selanjutnya
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Keluarga Sehat</h3>
                <p className="text-muted-foreground">
                  Mempersiapkan generasi yang lebih sehat dengan perencanaan yang tepat
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="manfaat" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Manfaat Menggunakan GenSave
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Proses Mudah dan Cepat</h3>
                    <p className="text-muted-foreground">
                      Screening dapat dilakukan dengan mudah melalui aplikasi tanpa perlu antri panjang
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Hasil Akurat dan Terpercaya</h3>
                    <p className="text-muted-foreground">
                      Menggunakan teknologi terkini dengan standar medis internasional
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Konsultasi dengan Ahli</h3>
                    <p className="text-muted-foreground">
                      Akses langsung ke konsultasi dengan dokter spesialis genetik
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Privasi Terjamin</h3>
                    <p className="text-muted-foreground">
                      Data kesehatan Anda dilindungi dengan enkripsi tingkat tinggi
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Harga Terjangkau</h3>
                    <p className="text-muted-foreground">
                      Biaya screening yang kompetitif dengan kualitas pelayanan terbaik
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Laporan Komprehensif</h3>
                    <p className="text-muted-foreground">
                      Mendapatkan laporan lengkap dengan rekomendasi yang mudah dipahami
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Siap Memulai Screening Genetik?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ambil langkah pertama untuk masa depan keluarga yang lebih sehat. Proses screening hanya membutuhkan
              beberapa menit.
            </p>
            <Link href="/screening">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full">
                Mulai Screening Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">GenSave</span>
              </div>
              <p className="text-muted-foreground">
                Membantu mempersiapkan generasi yang lebih sehat melalui screening genetik pranikah.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">info@gensave.id</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">+62 21 1234 5678</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Tautan</h3>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                  Kebijakan Privasi
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                  Syarat & Ketentuan
                </Link>
                <Link href="/help" className="block text-muted-foreground hover:text-primary transition-colors">
                  Bantuan
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-muted-foreground">© 2024 GenSave. Semua hak dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
