import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

interface ScreeningData {
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

export async function POST(request: NextRequest) {
  try {
    const data: ScreeningData = await request.json()

    // Validate required fields
    const requiredFields: (keyof ScreeningData)[] = [
      "nama",
      "jenisKelamin",
      "tempatLahir",
      "tanggalLahir",
      "umur",
      "tinggiBadan",
      "beratBadan",
      "alamat",
      "hemoglobinRendah",
      "cepatLelah",
      "keluargaTalasemia",
    ]

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        return NextResponse.json({ error: `Field ${field} is required` }, { status: 400 })
      }
    }

    // Create timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")

    // Clean name for filename (remove special characters)
    const cleanName = data.nama
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase()

    // Create filename
    const filename = `${cleanName}_${timestamp}.txt`

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data", "screening")
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Format data for text file
    const fileContent = `
HASIL SCREENING GENETIK GENSAVE
===============================

Data Pribadi:
- Nama Lengkap: ${data.nama}
- Jenis Kelamin: ${data.jenisKelamin}
- Tempat Lahir: ${data.tempatLahir}
- Tanggal Lahir: ${data.tanggalLahir}
- Umur: ${data.umur} tahun
- Tinggi Badan: ${data.tinggiBadan} cm
- Berat Badan: ${data.beratBadan} kg
- Alamat: ${data.alamat}

Hasil Screening Thalasemia:
- Kadar hemoglobin rendah: ${data.hemoglobinRendah}
- Sering merasa cepat lelah: ${data.cepatLelah}
- Keluarga menderita Thalasemia: ${data.keluargaTalasemia}

Waktu Screening: ${new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}

===============================
Data ini bersifat rahasia dan hanya untuk keperluan medis.
    `.trim()

    // Write file
    const filePath = path.join(dataDir, filename)
    await writeFile(filePath, fileContent, "utf8")

    console.log(`[GenSave] Screening data saved: ${filename}`)

    return NextResponse.json({
      success: true,
      message: "Data screening berhasil disimpan",
      filename: filename,
    })
  } catch (error) {
    console.error("[GenSave] Error saving screening data:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat menyimpan data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
