import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnyRecord = Record<string, any>;

// definisi bobot pertanyaan per penyakit (harus match field di FE)
const DISEASES = [
  {
    title: "Thalasemia",
    questions: [
      { field: "hemoglobinRendah", label: "HB rendah", weight: 30 },
      { field: "cepatLelah", label: "Cepat lelah", weight: 30 },
      { field: "keluargaTalasemia", label: "Riwayat keluarga", weight: 40 },
    ],
  },
  {
    title: "Diabetes Melitus",
    questions: [
      { field: "dm_bak_malam", label: "BAK malam", weight: 25 },
      { field: "dm_lapar_banyak", label: "Lapar berlebih", weight: 25 },
      { field: "dm_haus_sering", label: "Haus sering", weight: 25 },
      { field: "dm_keluarga_dm", label: "Riwayat keluarga", weight: 25 },
    ],
  },
  {
    title: "Hipertensi",
    questions: [
      { field: "hpt_sakit_kepala", label: "Sakit kepala belakang", weight: 30 },
      { field: "hpt_tekanan_tinggi", label: "Tekanan > 130/80", weight: 30 },
      { field: "hpt_keluarga_hpt", label: "Riwayat keluarga", weight: 40 },
    ],
  },
  {
    title: "Kanker",
    questions: [
      { field: "knk_benjolan", label: "Benjolan menetap", weight: 30 },
      { field: "knk_nyeri_berat", label: "Nyeri berat/ tak terkontrol", weight: 30 },
      { field: "knk_keluarga_kanker", label: "Riwayat keluarga", weight: 40 },
    ],
  },
  {
    title: "Penyakit Jantung",
    questions: [
      { field: "jtg_cepat_lelah", label: "Cepat lelah", weight: 20 },
      { field: "jtg_berdebar_sesak", label: "Berdebar + sesak", weight: 20 },
      { field: "jtg_nyeri_dada", label: "Nyeri dada kiri", weight: 20 },
      { field: "jtg_pjb", label: "PJB", weight: 20 },
      { field: "jtg_keluarga_jantung", label: "Riwayat keluarga", weight: 20 },
    ],
  },
  {
    title: "Disabilitas / Cacat",
    questions: [
      { field: "dis_fisik", label: "Fisik", weight: 20 },
      { field: "dis_intelektual", label: "Intelektual", weight: 20 },
      { field: "dis_mental", label: "Mental", weight: 20 },
      { field: "dis_sensorik", label: "Sensorik", weight: 20 },
      { field: "dis_keluarga_disabilitas", label: "Riwayat keluarga", weight: 20 },
    ],
  },
  {
    title: "Buta Warna",
    questions: [
      { field: "bw_bingung_umum", label: "Semua warna pudar/serupa", weight: 30 },
      { field: "bw_bingung_rgby", label: "Merah–hijau / biru–kuning", weight: 30 },
      { field: "bw_keluarga_bw", label: "Riwayat keluarga", weight: 40 },
    ],
  },
  {
    title: "Hemofilia",
    questions: [
      { field: "hf_perdarahan", label: "Perdarahan sering", weight: 50 },
      { field: "hf_keluarga_hf", label: "Riwayat keluarga", weight: 50 },
    ],
  },
] as const;

function scoreByWeight(v: unknown, w: number) {
  const s = String(v || "").toLowerCase();
  if (s === "ya") return w;
  if (s === "kadang-kadang") return Math.round(w / 2);
  if (s === "tidak-tahu") return Math.round(w / 3);
  return 0;
}

function computeResults(payload: AnyRecord) {
  const items = DISEASES.map((g) => {
    const val = Math.max(
      0,
      Math.min(
        100,
        Math.round(g.questions.reduce((a, q) => a + scoreByWeight(payload[q.field], q.weight), 0))
      )
    );
    return { key: g.title, val };
  });
  const overall = Math.round(items.reduce((a, b) => a + b.val, 0) / items.length);
  const top = items.slice().sort((a, b) => b.val - a.val)[0];
  return { items, overall, top };
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as AnyRecord;

    // Wajib hanya data personal
    const required = ["nama", "jenisKelamin", "tempatLahir", "tanggalLahir", "umur", "tinggiBadan", "beratBadan", "alamat"];
    for (const k of required) {
      if (!data[k] || String(data[k]).trim() === "") {
        return NextResponse.json({ error: `Field ${k} is required` }, { status: 400 });
      }
    }

    // Hasil scoring (untuk dirangkum)
    const results = computeResults(data);

    // Persiapan nama file
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const cleanName = String(data.nama).replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_").toLowerCase();
    const base = `${cleanName}_${ts}`;

    const dataDir = path.join(process.cwd(), "data", "screening");
    if (!existsSync(dataDir)) await mkdir(dataDir, { recursive: true });

    // TXT (human readable)
    const txt = [
      "HASIL SCREENING GENETIK GENSAVE",
      "===============================",
      "",
      "Data Pribadi:",
      `- Nama Lengkap: ${data.nama}`,
      `- Jenis Kelamin: ${data.jenisKelamin}`,
      `- Tempat Lahir: ${data.tempatLahir}`,
      `- Tanggal Lahir: ${data.tanggalLahir}`,
      `- Umur: ${data.umur} tahun`,
      `- Tinggi Badan: ${data.tinggiBadan} cm`,
      `- Berat Badan: ${data.beratBadan} kg`,
      `- Alamat: ${data.alamat}`,
      "",
      ...DISEASES.flatMap((g) => ([
        `Hasil ${g.title}: ${results.items.find((i) => i.key === g.title)?.val}%`,
        ...g.questions.map((q) => `- ${q.label}: ${data[q.field] ?? "-"}`),
        "",
      ])),
      `Waktu Screening: ${new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`,
      "",
      "===============================",
      "Data ini bersifat rahasia dan hanya untuk keperluan medis.",
    ].join("\n");

    await writeFile(path.join(dataDir, `${base}.txt`), txt, "utf8");

    // JSON (mentahan + ringkasan)
    const jsonOut = {
      submittedAt: new Date().toISOString(),
      personal: {
        nama: data.nama,
        jenisKelamin: data.jenisKelamin,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir,
        umur: data.umur,
        tinggiBadan: data.tinggiBadan,
        beratBadan: data.beratBadan,
        alamat: data.alamat,
      },
      answers: data,
      results,
    };
    await writeFile(path.join(dataDir, `${base}.json`), JSON.stringify(jsonOut, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: "Data screening berhasil disimpan",
      fileTxt: `${base}.txt`,
      fileJson: `${base}.json`,
      results,
    });
  } catch (err) {
    console.error("[GenSave] Error saving screening data:", err);
    return NextResponse.json({ error: "Terjadi kesalahan saat menyimpan data" }, { status: 500 });
  }
}

export async function GET()  { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export async function PUT()  { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export async function DELETE(){ return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
