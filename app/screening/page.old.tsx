"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { Heart, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FormData {
  nama: string
  jenisKelamin: string
  tempatLahir: string
  tanggalLahir: string
  umur: string
  tinggiBadan: string
  beratBadan: string
  alamat: string
  hemoglobinRendah: string
  cepatLelah: string
  keluargaTalasemia: string
}

export default function ScreeningPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
    umur: "",
    tinggiBadan: "",
    beratBadan: "",
    alamat: "",
    hemoglobinRendah: "",
    cepatLelah: "",
    keluargaTalasemia: "",
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/screening", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Redirect to success page or show success message
        router.push("/screening/success")
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Kembali</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">GenSave</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Form Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Formulir Screening Genetik</h1>
            <p className="text-lg text-muted-foreground">
              Silakan isi data diri dan jawab pertanyaan screening berikut dengan lengkap dan jujur.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Data Pribadi</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="nama">Nama Lengkap *</Label>
                    <Input
                      id="nama"
                      type="text"
                      value={formData.nama}
                      onChange={(e) => handleInputChange("nama", e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      required
                    />
                  </div>

                  <div>
                    <Label>Jenis Kelamin *</Label>
                    <RadioGroup
                      value={formData.jenisKelamin}
                      onValueChange={(value) => handleInputChange("jenisKelamin", value)}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="laki-laki" id="laki-laki" />
                        <Label htmlFor="laki-laki">Laki-laki</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="perempuan" id="perempuan" />
                        <Label htmlFor="perempuan">Perempuan</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tempatLahir">Tempat Lahir *</Label>
                      <Input
                        id="tempatLahir"
                        type="text"
                        value={formData.tempatLahir}
                        onChange={(e) => handleInputChange("tempatLahir", e.target.value)}
                        placeholder="Kota tempat lahir"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                      <Input
                        id="tanggalLahir"
                        type="date"
                        value={formData.tanggalLahir}
                        onChange={(e) => handleInputChange("tanggalLahir", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="umur">Umur *</Label>
                      <Input
                        id="umur"
                        type="number"
                        value={formData.umur}
                        onChange={(e) => handleInputChange("umur", e.target.value)}
                        placeholder="Tahun"
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tinggiBadan">Tinggi Badan (cm) *</Label>
                      <Input
                        id="tinggiBadan"
                        type="number"
                        value={formData.tinggiBadan}
                        onChange={(e) => handleInputChange("tinggiBadan", e.target.value)}
                        placeholder="170"
                        min="100"
                        max="250"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="beratBadan">Berat Badan (kg) *</Label>
                      <Input
                        id="beratBadan"
                        type="number"
                        value={formData.beratBadan}
                        onChange={(e) => handleInputChange("beratBadan", e.target.value)}
                        placeholder="70"
                        min="30"
                        max="200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="alamat">Alamat Lengkap *</Label>
                    <Textarea
                      id="alamat"
                      value={formData.alamat}
                      onChange={(e) => handleInputChange("alamat", e.target.value)}
                      placeholder="Masukkan alamat lengkap Anda"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Screening Questions */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Pertanyaan Screening Thalasemia</h3>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">
                        1. Apakah Anda memiliki kadar hemoglobin rendah? *
                      </Label>
                      <RadioGroup
                        value={formData.hemoglobinRendah}
                        onValueChange={(value) => handleInputChange("hemoglobinRendah", value)}
                        className="flex gap-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ya" id="hb-ya" />
                          <Label htmlFor="hb-ya">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tidak" id="hb-tidak" />
                          <Label htmlFor="hb-tidak">Tidak</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tidak-tahu" id="hb-tidak-tahu" />
                          <Label htmlFor="hb-tidak-tahu">Tidak Tahu</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">2. Apakah Anda sering merasa cepat lelah? *</Label>
                      <RadioGroup
                        value={formData.cepatLelah}
                        onValueChange={(value) => handleInputChange("cepatLelah", value)}
                        className="flex gap-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ya" id="lelah-ya" />
                          <Label htmlFor="lelah-ya">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tidak" id="lelah-tidak" />
                          <Label htmlFor="lelah-tidak">Tidak</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="kadang-kadang" id="lelah-kadang" />
                          <Label htmlFor="lelah-kadang">Kadang-kadang</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium">
                        3. Apakah keluarga Anda ada yang menderita Thalasemia? *
                      </Label>
                      <RadioGroup
                        value={formData.keluargaTalasemia}
                        onValueChange={(value) => handleInputChange("keluargaTalasemia", value)}
                        className="flex gap-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ya" id="keluarga-ya" />
                          <Label htmlFor="keluarga-ya">Ya</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tidak" id="keluarga-tidak" />
                          <Label htmlFor="keluarga-tidak">Tidak</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tidak-tahu" id="keluarga-tidak-tahu" />
                          <Label htmlFor="keluarga-tidak-tahu">Tidak Tahu</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full" disabled={!isFormValid() || isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim Data...
                      </>
                    ) : (
                      "Kirim Data Screening"
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Data Anda akan diproses dengan aman dan terjaga kerahasiaannya
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
