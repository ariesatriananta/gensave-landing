import { mkdir, existsSync } from "fs"
import path from "path"

// Create data directory structure for screening results
const dataDir = path.join(process.cwd(), "data", "screening")

if (!existsSync(dataDir)) {
  mkdir(dataDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating data directory:", err)
    } else {
      console.log("Data directory created successfully:", dataDir)
    }
  })
} else {
  console.log("Data directory already exists:", dataDir)
}

// Create a .gitignore file in the data directory to prevent committing sensitive data
const gitignoreContent = `# Ignore all screening data files
*.txt
*.json
*.csv

# But keep the directory structure
!.gitkeep
`

import { writeFileSync } from "fs"

try {
  writeFileSync(path.join(dataDir, ".gitignore"), gitignoreContent)
  writeFileSync(path.join(dataDir, ".gitkeep"), "")
  console.log("Created .gitignore and .gitkeep files in data directory")
} catch (error) {
  console.error("Error creating git files:", error)
}
