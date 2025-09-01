"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { Heart, ArrowLeft, Loader2, Info, User, MapPin, Calendar, Ruler, Scale } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from 'next/image';


type Step = 1 | 2 | 3 | 4 | 5

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
  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

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
  });

  const BTN_PRIMARY =
    "bg-[#FFA052] hover:bg-orange-500 text-white shadow-sm " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2";

  const BTN_OUTLINE =
    "border-orange-200 text-orange-500 hover:bg-orange-100 hover:text-[#FFA052] border-[#FFA052] ";


  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  // ===== Validation per-step =====
  const validateStep2 = () => {
    const req: (keyof FormData)[] = [
      "nama",
      "jenisKelamin",
      "tempatLahir",
      "tanggalLahir",
      "umur",
      "tinggiBadan",
      "beratBadan",
      "alamat",
    ]
    const nextErrors: Partial<Record<keyof FormData, string>> = {}
    for (const k of req) {
      if (!String(formData[k] ?? "").trim()) nextErrors[k] = "Wajib diisi"
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateStep3 = () => {
    const req: (keyof FormData)[] = ["hemoglobinRendah", "cepatLelah", "keluargaTalasemia"]
    const nextErrors: Partial<Record<keyof FormData, string>> = {}
    for (const k of req) {
      if (!String(formData[k] ?? "").trim()) nextErrors[k] = "Pilih salah satu"
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  // ===== Scoring (placeholder logic) =====
  const results = useMemo(() => computeScores(formData), [formData])
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    []
  )

  const next = () => {
    if (step === 2 && !validateStep2()) return
    if (step === 3 && !validateStep3()) return
    setStep((s) => Math.min((s + 1) as Step, 5))
  }

  const prev = () => setStep((s) => Math.max((s - 1) as Step, 1))

  const submitAndFinish = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/screening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        router.push("/screening/success") // jika belum ada, ganti ke "/"
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-secondary/20 to-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 grid grid-cols-3 items-center">
           {/* Kiri: Tombol Kembali */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">Kembali</span>
              </Link>
            </div>

            {/* Tengah: Logo & Title */}
            <div className="flex justify-center items-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">GenSave</span>
            </div>

            {/* Kanan: Theme Toggle */}
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            
        </div>
      </header>

      {/* Body */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Title */}
          {/* <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Screening Catin</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Jawab beberapa pertanyaan untuk mendapatkan gambaran awal risiko. (± 2–3 menit)
            </p>
          </div> */}

          {/* Stepper */}
          <Stepper step={step} total={5} />

          {/* STEP 1 — Intro */}
          {step === 1 && (
            <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-md backdrop-blur-sm">
              <CardContent className="px-5 md:px-8 pt-0 pb-6">

                {/* Logo */}
                <div className="flex justify-center pt-2 pb-2">
                  <Image
                    src="/logo.png"
                    alt="Logo GenSave"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                
                {/* Konten lainnya */}
                <div className="space-y-4">
                  <p className="text-justify text-sm leading-snug text-foreground">
                    Aplikasi GenSave hadir sebagai solusi inovatif untuk mendeteksi penyakit genetik pada calon pengantin. 
                    Dengan menggunakan aplikasi ini, pasangan yang akan menikah dapat mengetahui riwayat kesehatan dan penyakit masing-masing, 
                    sehingga mereka dapat lebih siap dalam menghadapi risiko melahirkan anak dengan penyakit genetik atau disabilitas.
                  </p>
                  <p className="text-justify text-sm leading-snug text-foreground">
                    Melalui skrining pranikah yang dilakukan oleh GenSave, calon pengantin dapat mengetahui 
                    potensi penyakit genetik yang mungkin diturunkan kepada anak-anak mereka. 
                    Jika salah satu atau keduanya menderita suatu penyakit, 
                    maka mereka dapat segera diobati dan dikonsultasikan dengan dokter untuk mendapatkan penanganan yang tepat.
                  </p>
                  <p className="text-justify text-sm leading-snug text-foreground">
                    Dengan demikian, GenSave menjadi sebuah upaya penting dalam menjamin kelahiran bayi yang sehat secara mental dan fisik. 
                    Aplikasi ini tidak hanya membantu pasangan yang akan menikah, tetapi juga memberikan kontribusi pada kesehatan masyarakat secara keseluruhan. 
                    Dengan GenSave, kita dapat membangun masa depan yang lebih sehat dan bahagia bagi generasi mendatang.
                  </p>
                  {/* <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Data bersifat rahasia dan hanya untuk edukasi awal.</li>
                    <li>Jawab jujur agar hasil lebih representatif.</li>
                  </ul> */}
                  <div className="flex justify-center pt-4">
                    <Button onClick={next} size="lg" className={BTN_PRIMARY}>
                      Mulai Screening
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2 — Masukkan Data Diri */}
          {step === 2 && (
            <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-md backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-semibold text-center">Masukkan Data Diri</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 md:space-y-8">
                <div className="grid gap-6">
                  {/* Nama */}
                  <div className="grid gap-2">
                    <Label htmlFor="nama">Nama <span className="text-orange-600">*</span></Label>
                    <IconInput
                      id="nama"
                      icon={User}
                      placeholder="Nama lengkap"
                      value={formData.nama}
                      onChange={(v) => handleInputChange("nama", v)}
                    />
                    <ErrorText>{errors.nama}</ErrorText>
                  </div>

                  {/* Jenis Kelamin */}
                  <div className="grid gap-2">
                    <Label>Jenis Kelamin <span className="text-orange-600">*</span></Label>
                    <RadioGroup
                      value={formData.jenisKelamin}
                      onValueChange={(v) => handleInputChange("jenisKelamin", v)}
                      className="mt-1 flex flex-wrap gap-2"
                    >
                      <Segmented id="jk-l" value="laki-laki" label="Laki-laki" />
                      <Segmented id="jk-p" value="perempuan" label="Perempuan" />
                    </RadioGroup>
                    <ErrorText>{errors.jenisKelamin}</ErrorText>
                  </div>

                  {/* Tempat & Tanggal Lahir */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="tempatLahir">Tempat Lahir <span className="text-orange-600">*</span></Label>
                      <IconInput
                        id="tempatLahir"
                        icon={MapPin}
                        placeholder="Kota tempat lahir"
                        value={formData.tempatLahir}
                        onChange={(v) => handleInputChange("tempatLahir", v)}
                      />
                      <ErrorText>{errors.tempatLahir}</ErrorText>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tanggalLahir">Tanggal Lahir <span className="text-orange-600">*</span></Label>
                      <IconInput
                        id="tanggalLahir"
                        type="date"
                        icon={Calendar}
                        value={formData.tanggalLahir}
                        onChange={(v) => {
                          handleInputChange("tanggalLahir", v);
                          handleInputChange("umur", hitungUmur(v)); // auto umur
                        }}
                      />
                      <ErrorText>{errors.tanggalLahir}</ErrorText>
                    </div>
                  </div>

                  {/* Umur, Tinggi, Berat */}
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="umur">Umur <span className="text-orange-600">*</span></Label>
                      <IconInput id="umur" type="number" icon={User} value={formData.umur} readOnly placeholder="Tahun" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="tinggi">Tinggi Badan (cm) <span className="text-orange-600">*</span></Label>
                      <UnitInput
                        id="tinggi"
                        icon={Ruler}
                        unit="cm"
                        placeholder="170"
                        value={formData.tinggiBadan}
                        onChange={(v) => handleInputChange("tinggiBadan", v)}
                        min={80}
                        max={250}
                        error={errors.tinggiBadan}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="berat">Berat Badan (kg) <span className="text-orange-600">*</span></Label>
                      <UnitInput
                        id="berat"
                        icon={Scale}
                        unit="kg"
                        placeholder="70"
                        value={formData.beratBadan}
                        onChange={(v) => handleInputChange("beratBadan", v)}
                        min={25}
                        max={250}
                        error={errors.beratBadan}
                      />
                    </div>
                  </div>

                  {/* BMI chip (live) */}
                  <BMIChip tinggiCm={formData.tinggiBadan} beratKg={formData.beratBadan} />

                  {/* Alamat */}
                  <div className="grid gap-2">
                    <Label htmlFor="alamat">Alamat <span className="text-orange-600">*</span></Label>
                    <Textarea
                      id="alamat"
                      placeholder="Alamat domisili"
                      rows={3}
                      value={formData.alamat}
                      onChange={(e) => handleInputChange("alamat", e.target.value)}
                      className="focus-visible:ring-orange-500"
                    />
                    <ErrorText>{errors.alamat}</ErrorText>
                  </div>
                </div>

                {/* Tombol navigasi */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={prev} className={BTN_OUTLINE}>Kembali</Button>
                  <Button onClick={next} className={BTN_PRIMARY}>Lanjut</Button>
                </div>
              </CardContent>
            </Card>


          )}

          {/* STEP 3 — Thalasemia */}
          {step === 3 && (
            <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-md backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">Thalasemia</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Jawab jujur untuk hasil terbaik.
                    </p>
                  </div>

                  {/* Hint ringkas tanpa lib tambahan */}
                  <details className="select-none">
                    <summary className="inline-flex cursor-pointer items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground">
                      <Info className="h-4 w-4" />
                      Klik Untuk Detailnya
                    </summary>
                    <div className="mt-3 max-w-sm rounded-lg border bg-card p-3 text-xs leading-relaxed text-muted-foreground">
                      Thalasemia adalah kelainan darah turunan. Skrining dini membantu
                      perencanaan pemeriksaan lanjutan. Hasil di sini bukan diagnosis.
                    </div>
                  </details>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 md:space-y-6">
                {/* Q1 */}
                <QA
                  label="Apakah anda memiliki kadar hemoglobin (HB) rendah?"
                  value={formData.hemoglobinRendah}
                  onChange={(v) => handleInputChange("hemoglobinRendah", v)}
                  error={errors.hemoglobinRendah}
                />

                {/* Q2 */}
                <QA
                  label="Apakah anda sering merasa cepat lelah atau capek?"
                  value={formData.cepatLelah}
                  onChange={(v) => handleInputChange("cepatLelah", v)}
                  options={[
                    { id: "lelah-ya", value: "ya", label: "Ya" },
                    { id: "lelah-tidak", value: "tidak", label: "Tidak" },
                    { id: "lelah-kadang", value: "kadang-kadang", label: "Kadang-kadang" },
                  ]}
                  error={errors.cepatLelah}
                />

                {/* Q3 */}
                <QA
                  label="Apakah keluarga anda ada yang menderita Talasemia?"
                  value={formData.keluargaTalasemia}
                  onChange={(v) => handleInputChange("keluargaTalasemia", v)}
                  error={errors.keluargaTalasemia}
                />

                <div className="flex items-center justify-between pt-1">
                  <Button variant="outline" onClick={prev} className={BTN_OUTLINE}>Kembali</Button>
                  <Button onClick={next} className={BTN_PRIMARY}>Lanjut</Button>
                </div>
              </CardContent>
            </Card>

          )}

          {/* STEP 4 — Hasil Screening */}
          {step === 4 && (
            <Card className="rounded-2xl shadow-sm ring-0 ring-black/5">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-xl md:text-2xl">Hasil Screening</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 md:space-y-7">
                <div className="text-center">
                  <div className="text-5xl font-extrabold tracking-tight">{results.overall}%</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Berisiko Terkena Penyakit <b>{results.top?.key}</b>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{today}</p>
                </div>

                <blockquote className="rounded-lg border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
                  Hasil Ini Merupakan Screening Dasar. Segera Cek ke Puskesmas atau Rumah Sakit Terdekat Untuk Memastikan.
                </blockquote>

                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={prev} className={BTN_OUTLINE}>Kembali</Button>
                  <Button onClick={next} className={BTN_PRIMARY}>Lihat Detail</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 5 — HASIL SCREENING PER ITEM */}
          {step === 5 && (
            <Card className="rounded-2xl shadow-sm ring-0 ring-black/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl uppercase tracking-wide">
                  HASIL SCREENING PER ITEM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 md:space-y-6">
                <p className="text-xs text-muted-foreground">{today}</p>

                <ul className="space-y-3">
                  {results.items.map((it) => (
                    <li key={it.key} className="rounded-lg border p-3 md:p-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{it.key}</span>
                        <span className="font-semibold">{it.val}%</span>
                      </div>
                      <div className="h-2 rounded bg-muted">
                        <div className="h-2 rounded bg-primary" style={{ width: `${it.val}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>

                <blockquote className="rounded-lg border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
                  Hasil Ini Merupakan Screening Dasar. Segera Cek ke Puskesmas atau Rumah Sakit Terdekat Untuk Memastikan.
                </blockquote>

                <div className="flex items-center justify-between pt-1">
                  <Button variant="outline" onClick={prev} className={BTN_OUTLINE}>Kembali</Button>
                  <Button onClick={submitAndFinish} disabled={isSubmitting} className={BTN_PRIMARY}>
                    {isSubmitting ? (<>…</>) : "Selesai"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

/* ====== Utilities & kecil-kecil ====== */

function ErrorText({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return <p className="mt-1 text-xs text-red-600">{children}</p>
}

function RadioItem({ id, value, label }: { id: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem
        id={id}
        value={value}
        className="text-orange-600 border-orange-300 data-[state=checked]:bg-orange-600"
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}


function NumberField(props: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  min?: number
  max?: number
  error?: string
}) {
  const { id, label, value, onChange, placeholder, min, max, error } = props
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  )
}

function Stepper({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step - 1) / (total - 1)) * 100)
  return (
    <div className="mb-8">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>Langkah {step} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 rounded bg-muted">
        <div className="h-2 rounded bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const hitungUmur = (tanggal: string) => {
  const today = new Date();
  const birthDate = new Date(tanggal);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return isNaN(age) ? "" : String(age); // return string biar langsung masuk formData
};

// Input dengan ikon kiri
function IconInput({
  id, icon: Icon, className, onChange, ...rest
}: React.ComponentProps<typeof Input> & { icon: React.ElementType; onChange?: (v: string) => void }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        id={id}
        className={["pl-9 focus-visible:ring-orange-500", className || ""].join(" ")}
        onChange={(e) => onChange?.(e.target.value)}
        {...rest}
      />
    </div>
  );
}

// Input angka dengan suffix unit (cm/kg), ada ikon kiri
function UnitInput({
  id, icon: Icon, unit, error, onChange, className, ...rest
}: React.ComponentProps<typeof Input> & {
  icon: React.ElementType; unit: string; error?: string; onChange?: (v: string) => void
}) {
  return (
    <div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          id={id}
          type="number"
          className={["pl-9 pr-12 focus-visible:ring-orange-500", className || ""].join(" ")}
          onChange={(e) => onChange?.(e.target.value)}
          {...rest}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
          {unit}
        </span>
      </div>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

// Radio pill (segmented)
function Segmented({ id, value, label }: { id: string; value: string; label: string }) {
  return (
    <div className="relative">
      <RadioGroupItem id={id} value={value} className="peer sr-only" />
      <Label
        htmlFor={id}
        className={[
          "inline-flex cursor-pointer select-none items-center justify-center",
          "rounded-lg border px-3 py-2 text-sm",
          "border-slate-300 text-slate-700 hover:bg-orange-50",
          "peer-checked:border-orange-500 peer-checked:bg-orange-100 peer-checked:text-orange-700",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500 peer-focus-visible:ring-offset-2",
          "transition-colors",
        ].join(" ")}
      >
        {label}
      </Label>
    </div>
  );
}

// BMI badge live
function BMIChip({ tinggiCm, beratKg }: { tinggiCm: string; beratKg: string }) {
  const data = useMemo(() => {
    const h = parseFloat(tinggiCm); const w = parseFloat(beratKg);
    if (!h || !w) return null;
    const m = h / 100;
    const bmi = +(w / (m * m)).toFixed(1);
    let label = "Normal", tone = "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (bmi < 18.5) { label = "Kurus"; tone = "bg-amber-50 text-amber-700 border-amber-200"; }
    else if (bmi >= 25 && bmi < 30) { label = "Berlebih"; tone = "bg-orange-50 text-orange-700 border-orange-200"; }
    else if (bmi >= 30) { label = "Obesitas"; tone = "bg-red-50 text-red-700 border-red-200"; }
    return { bmi, label, tone };
  }, [tinggiCm, beratKg]);

  if (!data) return null;
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${data.tone}`}>
        BMI {data.bmi} — {data.label}
      </span>
      <span className="text-xs text-muted-foreground">(*Estimasi, bukan diagnosis.)</span>
    </div>
  );
}




function QA({
  label,
  value,
  onChange,
  options = [
    { id: "ya", value: "ya", label: "Ya" },
    { id: "tidak", value: "tidak", label: "Tidak" },
  ],
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options?: { id: string; value: string; label: string }[]
}) {
  return (
    <div>
      <Label className="text-base font-medium">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="mt-2 flex flex-wrap gap-6">
        {options.map((o) => (
          <div key={o.id} className="flex items-center gap-2">
            <RadioGroupItem id={o.id} value={o.value} />
            <Label htmlFor={o.id}>{o.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

function scoreYN(v: string, yes = 50, no = 0) {
  // treat "kadang-kadang" as moderate yes
  if (v === "tidak") return no
  if (v === "tidak-tahu") return Math.round((yes + no) / 3)
  if (v === "kadang-kadang") return Math.round((yes + no) / 2)
  return yes
}

function computeScores(v: FormData) {
  const items = [
    {
      key: "Thalasemia",
      val: Math.max(
        0,
        Math.min(
          100,
          Math.round(scoreYN(v.hemoglobinRendah, 35) + scoreYN(v.cepatLelah, 20) + scoreYN(v.keluargaTalasemia, 45))
        )
      ),
    },
  ]
  const overall = Math.round(items.reduce((a, b) => a + b.val, 0) / items.length)
  const top = items.slice().sort((a, b) => b.val - a.val)[0]
  return { items, overall, top }
}
