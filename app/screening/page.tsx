"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { Heart, ArrowLeft, Loader2, Info, User, MapPin, Calendar, Ruler, Scale } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from 'next/image';


type Step = number

interface FormData {
  nama: string
  jenisKelamin: string
  tempatLahir: string
  tanggalLahir: string
  umur: string
  tinggiBadan: string
  beratBadan: string
  alamat: string

   // Thalasemia
  hemoglobinRendah: string
  cepatLelah: string
  keluargaTalasemia: string
  // Diabetes Melitus
  dm_bak_malam: string
  dm_lapar_banyak: string
  dm_haus_sering: string
  dm_keluarga_dm: string
  // Hipertensi
  hpt_sakit_kepala: string
  hpt_tekanan_tinggi: string
  hpt_keluarga_hpt: string
  // Kanker
  knk_benjolan: string
  knk_nyeri_berat: string
  knk_keluarga_kanker: string
  // Penyakit Jantung
  jtg_cepat_lelah: string
  jtg_berdebar_sesak: string
  jtg_nyeri_dada: string
  jtg_pjb: string
  jtg_keluarga_jantung: string
  // Disabilitas/Cacat
  dis_fisik: string
  dis_intelektual: string
  dis_mental: string
  dis_sensorik: string
  dis_keluarga_disabilitas: string
  // Buta Warna
  bw_bingung_umum: string
  bw_bingung_rgby: string
  bw_keluarga_bw: string
  // Hemofilia
  hf_perdarahan: string
  hf_keluarga_hf: string
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
    hemoglobinRendah: "", cepatLelah: "", keluargaTalasemia: "",
    dm_bak_malam: "", dm_lapar_banyak: "", dm_haus_sering: "", dm_keluarga_dm: "",
    hpt_sakit_kepala: "", hpt_tekanan_tinggi: "", hpt_keluarga_hpt: "",
    knk_benjolan: "", knk_nyeri_berat: "", knk_keluarga_kanker: "",
    jtg_cepat_lelah: "", jtg_berdebar_sesak: "", jtg_nyeri_dada: "", jtg_pjb: "", jtg_keluarga_jantung: "",
    dis_fisik: "", dis_intelektual: "", dis_mental: "", dis_sensorik: "", dis_keluarga_disabilitas: "",
    bw_bingung_umum: "", bw_bingung_rgby: "", bw_keluarga_bw: "",
    hf_perdarahan: "", hf_keluarga_hf: "",
  });

  type DiseaseQuestion = { field: keyof FormData; label: string; weight: number }
  type DiseaseGroup = { key: string; title: string; questions: DiseaseQuestion[] }

  const DISEASES: DiseaseGroup[] = [
    { // 1) Thalasemia
      key: "thal", title: "Thalasemia",
      questions: [
        { field: "hemoglobinRendah",   label: "Apakah anda memiliki kadar hemoglobin (HB) rendah?", weight: 30 },
        { field: "cepatLelah",         label: "Apakah anda sering merasa cepat lelah atau capek?",   weight: 30 },
        { field: "keluargaTalasemia",  label: "Apakah keluarga anda ada yang menderita Talasemia?",  weight: 40 },
      ],
    },
    { // 2) Diabetes Melitus
      key: "dm", title: "Diabetes Melitus",
      questions: [
        { field: "dm_bak_malam",    label: "Apakah anda sering BAK pada malam hari?", weight: 25 },
        { field: "dm_lapar_banyak", label: "Apakah anda sering merasa lapar dan makan lebih banyak dari biasanya?", weight: 25 },
        { field: "dm_haus_sering",  label: "Apakah anda sering merasa haus walaupun sering minum?", weight: 25 },
        { field: "dm_keluarga_dm",  label: "Apakah keluarga anda ada yang menderita Diabetes Melitus / Penyakit Gula?", weight: 25 },
      ],
    },
    { // 3) Hipertensi
      key: "hpt", title: "Hipertensi",
      questions: [
        { field: "hpt_sakit_kepala",   label: "Apakah anda sering merasakan sakit kepala bagian belakang?", weight: 30 },
        { field: "hpt_tekanan_tinggi", label: "Apakah tekanan darah anda lebih dari 130/80?", weight: 30 },
        { field: "hpt_keluarga_hpt",   label: "Apakah keluarga anda ada yang menderita Hipertensi?", weight: 40 },
      ],
    },
    { // 4) Kanker
      key: "knk", title: "Kanker",
      questions: [
        { field: "knk_benjolan",        label: "Apakah anda terdapat benjolan yang tidak normal (menetap) di bagian tubuh?", weight: 30 },
        { field: "knk_nyeri_berat",     label: "Apakah anda sering merasakan nyeri berat dan tidak terkontrol?", weight: 30 },
        { field: "knk_keluarga_kanker", label: "Apakah keluarga anda ada yang menderita Kanker?", weight: 40 },
      ],
    },
    { // 5) Penyakit Jantung
      key: "jtg", title: "Penyakit Jantung",
      questions: [
        { field: "jtg_cepat_lelah",      label: "Apakah anda cepat merasa lelah atau capek?", weight: 20 },
        { field: "jtg_berdebar_sesak",   label: "Apakah anda merasakan jantung berdebar yang diikuti dengan sesak nafas?", weight: 20 },
        { field: "jtg_nyeri_dada",       label: "Apakah anda terdapat nyeri dada seperti terbakar di sebelah kiri?", weight: 20 },
        { field: "jtg_pjb",              label: "Apakah anda mempunyai penyakit jantung bawaan/PJB?", weight: 20 },
        { field: "jtg_keluarga_jantung", label: "Apakah keluarga anda ada yang menderita Penyakit Jantung?", weight: 20 },
      ],
    },
    { // 6) Disabilitas/Cacat
      key: "dis", title: "Disabilitas / Cacat",
      questions: [
        { field: "dis_fisik",                label: "Fisik", weight: 20 },
        { field: "dis_intelektual",          label: "Intelektual", weight: 20 },
        { field: "dis_mental",               label: "Mental", weight: 20 },
        { field: "dis_sensorik",             label: "Sensorik", weight: 20 },
        { field: "dis_keluarga_disabilitas", label: "Apakah keluarga anda ada yang mengalami disabilitas/cacat?", weight: 20 },
      ],
    },
    { // 7) Buta Warna
      key: "bw", title: "Buta Warna",
      questions: [
        { field: "bw_bingung_umum", label: "Apakah anda tidak bisa membedakan warna atau semua warna tampak pudar/serupa?", weight: 30 },
        { field: "bw_bingung_rgby", label: "Apakah anda tidak bisa membedakan warna (merah–hijau / biru–kuning)?", weight: 30 },
        { field: "bw_keluarga_bw",  label: "Apakah keluarga anda ada yang menderita Buta Warna?", weight: 40 },
      ],
    },
    { // 8) Hemofilia
      key: "hf", title: "Hemofilia",
      questions: [
        { field: "hf_perdarahan", label: "Apakah anda sering mengalami perdarahan (gusi/mimisan/memar)?", weight: 50 },
        { field: "hf_keluarga_hf", label: "Apakah keluarga anda ada yang menderita Hemofilia?", weight: 50 },
      ],
    },
  ]

  const BASE_AFTER_DATA = 2; // 1 intro, 2 data
  const totalSteps = 2 + DISEASES.length * 2 + 1; // +1 summary

  function getDiseaseStep(s: number):
    | { idx: number; type: "qa" | "result"; group: DiseaseGroup }
    | null {
    const start = BASE_AFTER_DATA + 1;
    const end = BASE_AFTER_DATA + DISEASES.length * 2;
    if (s < start || s > end) return null;
    const offset = s - start; // 0-based
    const idx = Math.floor(offset / 2);
    const type: "qa" | "result" = offset % 2 === 0 ? "qa" : "result";
    return { idx, type, group: DISEASES[idx] };
  }

  // hasil per penyakit (buat summary)
  const diseaseResults = useMemo(
    () => DISEASES.map((g) => ({ key: g.title, val: computeDiseaseScore(g, formData) })),
    [formData, DISEASES]
  );

  // rata-rata keseluruhan
  const overall = useMemo(
    () => Math.round(diseaseResults.reduce((a, b) => a + b.val, 0) / diseaseResults.length),
    [diseaseResults]
  );


  const CONTRIBUTORS = [
    "Fifi Alviana",
    "Candra Dewi Rahayu",
    "Aura Aulia",
    "Anisa Rohma Ningrum",
    "Erika Lestari",
  ];

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

  // ===== Scoring (placeholder logic) =====
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    []
  )

  const validateDisease = (group: DiseaseGroup) => {
    const next: Partial<Record<keyof FormData, string>> = {}
    for (const q of group.questions) {
      if (!String(formData[q.field] ?? "").trim()) next[q.field] = "Pilih salah satu"
    }
    setErrors((e) => ({ ...e, ...next }))
    return Object.keys(next).length === 0
  }

  const next = () => {
    if (step === 2 && !validateStep2()) return
    const ds = getDiseaseStep(step)
    if (ds && ds.type === "qa" && !validateDisease(ds.group)) return
    setStep((s) => Math.min(s + 1, totalSteps))
  }
  const prev = () => setStep((s) => Math.max(s - 1, 1))

  const submitAndFinish = () => {
    // payload mentahan + timestamp
    const payload = { ...formData, $submittedAt: new Date().toISOString() };

    try {
      // kirim diam-diam; tidak blok UI
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        (navigator as any).sendBeacon("/api/screening", blob);
        router.replace("/screening/success");
        return;
      }
    } catch (e) {
      console.warn("sendBeacon failed, fallback to fetch:", e);
    }

    // fallback: fetch keepalive, tapi navigasi TETAP jalan
    fetch("/api/screening", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      cache: "no-store",
    }).catch((e) => console.warn("submit error:", e));

    router.replace("/screening/success");
  };

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
              <Image
                src="/logo.png"
                alt="Logo GenSave"
                width={40}
                height={40}
                className="object-contain"
              />
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
          <Stepper step={step} total={totalSteps} />

          {/* STEP 1 — Intro */}
          {step === 1 && (
            <Card className="rounded-2xl border border-border/80 bg-card/90 shadow-md backdrop-blur-sm
                 supports-[backdrop-filter]:bg-card/80 dark:supports-[backdrop-filter]:bg-card/60">

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
            <Card className="rounded-2xl border border-border/80 bg-card/90 shadow-md backdrop-blur-sm
                 supports-[backdrop-filter]:bg-card/80 dark:supports-[backdrop-filter]:bg-card/60">
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
                    <PillsGroup
                      ariaLabel="Jenis Kelamin"
                      value={formData.jenisKelamin}
                      onChange={(v) => handleInputChange("jenisKelamin", v)}
                      options={[
                        { value: "laki-laki", label: "Laki-laki" },
                        { value: "perempuan", label: "Perempuan" },
                      ]}
                    />
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

          {/* ====== DISEASE STEPS (QA / RESULT) ====== */}
          {(() => {
            const ds = getDiseaseStep(step)
            if (!ds) return null

            if (ds.type === "qa") {
              const g = ds.group
              return (
                <Card className="rounded-2xl border border-border/80 bg-card/90 shadow-md backdrop-blur-sm
                                supports-[backdrop-filter]:bg-card/80 dark:supports-[backdrop-filter]:bg-card/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-semibold">{g.title}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">Jawab jujur untuk hasil terbaik.</p>
                  </CardHeader>
                  <CardContent className="space-y-5 md:space-y-6">
                    {g.questions.map((q) => (
                      <QA
                        key={String(q.field)}
                        label={q.label}
                        value={formData[q.field]}
                        onChange={(v) => handleInputChange(q.field, v)}
                        error={errors[q.field]}
                        // default opsi: Ya/Tidak (bisa tambahkan "Kadang-kadang" kalau perlu)
                      />
                    ))}
                    <div className="flex items-center justify-between pt-1">
                      <Button variant="outline" onClick={prev} className={BTN_OUTLINE}>Kembali</Button>
                      <Button onClick={next} className={BTN_PRIMARY}>Lihat Hasil</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            }

            // RESULT untuk penyakit ini
            const g = ds.group
            const score = computeDiseaseScore(g, formData)
            return (
              <Card className="rounded-2xl border border-border/80 bg-card/90 shadow-md backdrop-blur-sm
                              supports-[backdrop-filter]:bg-card/80 dark:supports-[backdrop-filter]:bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-semibold text-center">Hasil {g.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 md:space-y-7">
                  <p className="text-xs font-semibold text-center text-foreground/80">{today}</p>
                  <DonutChart value={score} size={200} thickness={20} duration={1200} />
                  <p className="text-center text-lg font-semibold text-[#FFA052]">
                    Perkiraan Risiko {g.title}: <span className="font-black">{score}%</span>
                  </p>
                  <blockquote className="rounded-lg border p-3 text-xs leading-relaxed text-center
                                        bg-orange-50 text-orange-800 border-orange-200
                                        dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900">
                    Hasil ini merupakan screening dasar. Segera cek ke fasilitas kesehatan untuk memastikan.
                    <br/><br/><em>&ldquo;Jangan pernah kehilangan harapan karena sesungguhnya setiap kesulitan pasti ada kemudahan.&rdquo;</em>
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={prev} className={BTN_OUTLINE}>Kembali</Button>
                    <Button onClick={next} className={BTN_PRIMARY}>Lanjut</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })()}
          
          {/* ====== SUMMARY (STEP TERAKHIR) ====== */}
          {step === totalSteps && (
            <Card className="rounded-2xl border border-border/80 bg-card/90 shadow-md backdrop-blur-sm
                            supports-[backdrop-filter]:bg-card/80 dark:supports-[backdrop-filter]:bg-card/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-semibold">Ringkasan Hasil Screening</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 md:space-y-6">
                <p className="text-xs text-muted-foreground">{today}</p>

                <ul className="space-y-3">
                  {diseaseResults.map((it) => (
                    <li key={it.key} className="rounded-lg border p-3 md:p-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{it.key}</span>
                        <span className="font-semibold text-[#FFA052] dark:text-orange-300">{it.val}%</span>
                      </div>
                      <div className="h-2 rounded bg-muted">
                        <div className="h-2 rounded bg-[#FFA052] transition-all" style={{ width: `${it.val}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Rata-rata keseluruhan</p>
                  <div className="text-4xl font-extrabold text-[#FFA052]">{overall}%</div>
                </div>

                <blockquote className="rounded-lg border p-3 text-xs leading-relaxed text-center bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900">
                  Hasil ini merupakan screening dasar. Segera cek ke puskesmas atau rumah sakit terdekat untuk memastikan.
                  <br/><br/><em>&ldquo;Jangan pernah kehilangan harapan karena sesungguhnya setiap kesulitan pasti ada kemudahan.&rdquo;</em>
                </blockquote>

                <div className="flex items-center justify-between pt-1">
                  <Button variant="outline" onClick={prev} className={BTN_OUTLINE}>Kembali</Button>
                  <Button
                    type="button"
                    onClick={submitAndFinish}
                    disabled={isSubmitting}
                    className={BTN_PRIMARY}
                  >
                    {isSubmitting ? "…" : "Selesai"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          
        </div>
      </section>

      <footer id="kontak" className="bg-card border-t py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} <span className="font-semibold text-foreground">GenSave</span>. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">
                {CONTRIBUTORS.join(" • ")}
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>

    
  )
}

/* ====== Utilities & kecil-kecil ====== */

function ErrorText({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return <p className="mt-1 text-xs text-red-600">{children}</p>
}


function Stepper({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step - 1) / (total - 1)) * 100);

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs text-orange-700">
        <span>Langkah {step} / {total}</span>
        <span>{pct}%</span>
      </div>

      {/* Track oranye lembut + blur tipis */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-orange-100 ring-1 ring-orange-200/60">
        {/* Bar progress gradasi oranye */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FFA052] to-orange-500 transition-all"
          style={{ width: `${pct}%` }}
        />
        {/* Knob di ujung bar */}
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white ring-2 ring-orange-500"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
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
        className={["pl-9 focus-visible:ring-orange-500 dark:placeholder:text-slate-400", className || ""].join(" ")}
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


type PillOption = { value: string; label: string };

function PillsGroup({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: PillOption[];
  ariaLabel?: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="mt-1 flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={[
              "inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm transition-colors",
              selected
                ? "border-[#FFA052] bg-orange-100 text-[#FFA052] dark:bg-orange-950/60 dark:text-orange-300"
                : "border-slate-300 text-slate-700 hover:bg-orange-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-orange-950/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
            ].join(" ")}

          >
            {o.label}
          </button>
        );
      })}
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
      { value: "ya", label: "Ya" },
      { value: "tidak", label: "Tidak" },
    ],
    error,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options?: PillOption[];
    error?: string;
}) {
    const base = "rounded-xl border p-4 md:p-5 transition-colors";
    const ok   = "border-border bg-card hover:bg-muted/60";
    const bad  = "border-destructive/40 bg-destructive/10 text-destructive";


    return (
      <div className={`${base} ${error ? bad : ok}`}>
        <div className="mb-3 text-sm font-medium text-foreground">
          <span className="after:ml-0.5 after:text-orange-600 after:content-['*']">{label}</span>
        </div>

        <PillsGroup value={value} onChange={onChange} options={options} />

        {error && <ErrorText>{error}</ErrorText>}
      </div>
    );
}


function scoreYN(v: string, yes = 50, no = 0) {
  // treat "kadang-kadang" as moderate yes
  if (v === "tidak") return no
  if (v === "tidak-tahu") return Math.round((yes + no) / 3)
  if (v === "kadang-kadang") return Math.round((yes + no) / 2)
  return yes
}

function DonutChart({
  value,
  size = 240,
  thickness = 24,
  duration = 1000,
}: {
  value: number;
  size?: number;
  thickness?: number;
  duration?: number;
}) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;

  // animasi dashoffset
  const targetOffset = C * (1 - Math.max(0, Math.min(100, value)) / 100);
  const [offset, setOffset] = useState(C);

  useEffect(() => {
    // animasi easeOutCubic
    const start = performance.now();
    const from = C;
    const to = targetOffset;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setOffset(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, C, targetOffset, duration]);

  // id gradient unik
  const gradId = useMemo(() => `donutGrad-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block text-slate-300 dark:text-slate-700"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFA052" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{
            transformOrigin: "50% 50%",
            transform: "rotate(-90deg)",
          }}
        />
      </svg>

      {/* Label persen di tengah */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-5xl md:text-6xl font-black tracking-tight text-foreground">
          <CountUp to={Math.round(Math.max(0, Math.min(100, value)))} duration={duration} />%
        </div>
      </div>
    </div>
  );
}

function CountUp({ to, duration = 1000 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);

  return <>{n}</>;
}


function scoreByWeight(v: string, w: number) {
  if (v === "ya") return w
  if (v === "kadang-kadang") return Math.round(w / 2)
  if (v === "tidak-tahu") return Math.round(w / 3)
  return 0
}

function computeDiseaseScore(group: DiseaseGroup, v: FormData) {
  const s = group.questions.reduce((a, q) => a + scoreByWeight(v[q.field], q.weight), 0)
  return Math.max(0, Math.min(100, Math.round(s)))
}
