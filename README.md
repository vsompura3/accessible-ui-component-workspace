# Accessible UI Components Workspace

An interactive components library sandbox and playground catalog for testing and building accessible frontend components from scratch. 

This project uses a **Zero-Config, Folder-Driven Architecture** built on Next.js 16 (App Router), Tailwind CSS v4, Base UI, and Server-Side Code Highlighting.

---

## 🚀 Key Features

* **Dynamic Navigation & Routing**: Creating a folder in `components/` automatically registers the component on the index page grid and routes it. No static routing config tables are needed.
* **Auto Documentation Pages**: The catch-all layout dynamically generates pages for each component containing:
  * An interactive **Live Sandbox**.
  * Auto-extracted, syntax-highlighted **Implementation Code** tabs.
  * Structural **Accessibility specs** (Keyboard maps and ARIA semantic guidelines).
* **Zero-Bundle Highlighter**: Code syntax highlighting is processed entirely on the server using `shiki`, meaning no heavy code parsing JavaScript is shipped to client browsers.

---

## 📂 Project Structure

```
├── components/
│   ├── ui/                         # Base atomic primitives (button, input)
│   ├── docs-viewer.tsx             # Interactive layout component (client tabs, copy clipboard)
│   ├── otp/                        # Component folder example
│   │   ├── OtpInput.tsx            # Component logic
│   │   ├── demo.tsx                # Playground sandbox view
│   │   └── metadata.json           # A11y & description details
│   └── comment-thread/
│       ├── CommentThread.tsx
│       ├── demo.tsx
│       └── metadata.json
├── app/
│   ├── page.tsx                    # Landing page (dynamically lists components via fs readdir)
│   └── (accessible-blocks)/
│       └── [slug]/
│           └── page.tsx            # Catch-all page (loads demo, metadata, and handles server highlighting)
```

---

## 🛠️ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the local server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the components portal.

---

## 📝 How to Add a New Component

To document and test a new component, simply add a directory under `components/`. For example, to add a new `combobox` component:

### Step A: Create the Directory
Create the folder `components/combobox/` containing:
1. `ComboBox.tsx` (the raw component logic)
2. `demo.tsx` (the interactive playground container rendered on the page)
3. `metadata.json` (the component description and accessibility specs)

### Step B: Formulate `metadata.json`
Inside the component folder, describe the component and how screen readers or keyboard users interact with it:

```json
{
  "name": "ComboBox",
  "description": "An accessible autocomplete search input selecting options from a dynamic list popup.",
  "a11y": {
    "keyboardNavigation": [
      { "key": "ArrowDown", "description": "Moves focused option in dropdown list." },
      { "key": "ArrowUp", "description": "Moves focused option in dropdown list." },
      { "key": "Enter", "description": "Selects active item and closes suggestion box." }
    ],
    "ariaAttributes": [
      { "attribute": "role=\"combobox\"", "description": "Marks the text input container as a combobox control." },
      { "attribute": "aria-expanded", "description": "Communicates whether the option listbox is currently open or collapsed." }
    ]
  }
}
```

### Step C: Build the Playground Demo
Write your playground container inside `demo.tsx`. Keep this separate from your core component code so that users looking at the code block see only clean component implementation code.
```tsx
"use client"

import ComboBox from "./ComboBox"

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col items-center justify-center p-4">
      <ComboBox />
    </div>
  )
}
```

Once these files are created, the component will dynamically populate on the home page and have a documentation page ready at `/combobox`!
