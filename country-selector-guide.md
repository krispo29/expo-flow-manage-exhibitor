# คู่มือการนำ CountrySelector ไปใช้งานในโปรเจคอื่น

เอกสารนี้จะอธิบายขั้นตอนการนำ Component `CountrySelector` ไปใช้ในโปรเจค React/Next.js อื่นๆ อย่างละเอียด

## 1. สิ่งที่ต้องติดตั้ง (Prerequisites)

Component นี้มีการเรียกใช้ `lucide-react` สำหรับไอคอน และโครงสร้าง UI จาก `shadcn/ui` ดังนั้นในโปรเจคใหม่จำเป็นต้องติดตั้งสิ่งเหล่านี้ก่อน

### 1.1 ติดตั้ง Dependencies

```bash
npm install lucide-react
```

### 1.2 ติดตั้ง shadcn/ui components ที่จำเป็น

หากในโปรเจคยังไม่มี `shadcn/ui` ให้ setup ก่อน แล้วติดตั้ง components พื้นฐานที่ `CountrySelector` เรียกใช้:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add command
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add label
```

---

## 2. สร้างไฟล์ Mock Data สำหรับรายชื่อประเทศ

สร้างไฟล์ `src/mock/countries.ts` (หรือตำแหน่งอื่นตามโครงสร้างโปรเจค) เพื่อเก็บข้อมูลรายชื่อประเทศ

```typescript
// src/mock/countries.ts

export interface Country {
  code: string;
  name: string;
  phoneCode: string;
  flag: string;
  nationality: string;
}

export const countries: Country[] = [
  {
    code: "VN",
    name: "Vietnam",
    phoneCode: "+84",
    flag: "🇻🇳",
    nationality: "Vietnamese",
  },
  {
    code: "TH",
    name: "Thailand",
    phoneCode: "+66",
    flag: "🇹🇭",
    nationality: "Thai",
  },
  {
    code: "US",
    name: "United States",
    phoneCode: "+1",
    flag: "🇺🇸",
    nationality: "American",
  },
  {
    code: "GB",
    name: "United Kingdom",
    phoneCode: "+44",
    flag: "🇬🇧",
    nationality: "British",
  },
  {
    code: "JP",
    name: "Japan",
    phoneCode: "+81",
    flag: "🇯🇵",
    nationality: "Japanese",
  },
  {
    code: "CN",
    name: "China",
    phoneCode: "+86",
    flag: "🇨🇳",
    nationality: "Chinese",
  },
  {
    code: "SG",
    name: "Singapore",
    phoneCode: "+65",
    flag: "🇸🇬",
    nationality: "Singaporean",
  },
  // สามารถเพิ่มประเทศอื่นๆ ได้ตามต้องการ
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find((c) => c.code === code);
};

export const getCountryByPhoneCode = (
  phoneCode: string,
): Country | undefined => {
  return countries.find((c) => c.phoneCode === phoneCode);
};
```

_(หมายเหตุ: หากคุณต้องใช้รายชื่อประเทศจำนวนมาก สามารถคัดลอกข้อมูลทั้งหมดจากโปรเจคเดิมได้เลย)_

---

## 3. สร้าง Component `CountrySelector`

สร้างไฟล์ `src/components/forms/country-selector.tsx` และนำโค้ดด้านล่างไปใส่ (อย่าลืมปรับแก้ path ของ import ให้ตรงกับโครงสร้างในโปรเจคใหม่ของคุณ เช่น `@/components/...` หรือ `@/mock`)

```tsx
// src/components/forms/country-selector.tsx

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

// อิมพอร์ตข้อมูล mock ประเทศที่เราสร้างไว้
import { countries } from "@/mock/countries";

export interface CountrySelectorProps {
  value: string; // state ที่เก็บ code ของประเทศ (เช่น 'VN', 'TH')
  onChange: (countryCode: string) => void;
  label?: string;
  placeholder?: string;
  displayProperty?: "name" | "nationality"; // เลือกว่าจะโชว์ชื่อประเทศ หรือ สัญชาติ
}

export function CountrySelector({
  value,
  onChange,
  label = "Country",
  placeholder = "Select country",
  displayProperty = "name",
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);

  // เรียงลำดับรายชื่อประเทศตามตัวอักษรของ displayProperty โดยให้ 'VN' (Vietnam) อยู่บนสุดเสมอ
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => {
      const valA = a[displayProperty];
      const valB = b[displayProperty];
      if (a.code === "VN") return -1;
      if (b.code === "VN") return 1;
      return valA.localeCompare(valB);
    });
  }, [displayProperty]);

  const selectedCountry = countries.find((c) => c.code === value);

  return (
    <div className="space-y-2">
      {label && <Label>{label} *</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal bg-background"
          >
            {selectedCountry ? (
              <span className="flex items-center gap-2">
                {/* ดึงรูปธงชาติจาก flagcdn ตามรหัสประเทศ (code) */}
                <img
                  src={`https://flagcdn.com/${selectedCountry.code.toLowerCase()}.svg`}
                  alt={selectedCountry.name}
                  className="w-5 h-auto rounded-sm object-cover shadow-sm"
                />
                <span className="truncate">
                  {selectedCountry[displayProperty]}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder={`Search ${displayProperty}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {sortedCountries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country[displayProperty]}
                    onSelect={() => {
                      onChange(country.code);
                      setOpen(false); // ปิด popover เมื่อทำการเลือกแล้ว
                    }}
                  >
                    <span className="flex items-center gap-2 w-full">
                      <img
                        src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                        alt={country.name}
                        className="w-5 h-auto rounded-sm object-cover shadow-sm"
                      />
                      <span>{country[displayProperty]}</span>
                    </span>
                    {value === country.code && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

---

## 4. วิธีนำไปใช้งาน (Usage Example)

วิธีเรียกใช้งานในแบบฟอร์มหรือหน้าเพจต่างๆ ของคุณ:

```tsx
// src/app/example/page.tsx

"use client";

import { useState } from "react";
import { CountrySelector } from "@/components/forms/country-selector";

export default function ExamplePage() {
  // สร้าง state มารองรับค่าที่เลือก จะเก็บข้อมูลเป็น code ประเทศ เช่น 'TH', 'US'
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Select your Country</h1>

      {/* ใช้งาน Country Selector แบบระบุ Label */}
      <CountrySelector
        value={selectedCountry}
        onChange={(val) => setSelectedCountry(val)}
        label="Residence Country"
        placeholder="Select a country..."
        displayProperty="name" // สามารถเปลี่ยนเป็น "nationality" ได้ ถ้าต้องการให้แสดงสัญชาติ
      />

      {/* ดูผลลัพธ์การเลือก */}
      <div className="mt-4 p-4 border rounded bg-slate-50">
        <p className="text-sm">
          ค่าที่คุณเลือก (Country Code):{" "}
          <strong>{selectedCountry || "ยังไม่ได้เลือก"}</strong>
        </p>
      </div>
    </div>
  );
}
```

### การตั้งค่าที่สำคัญของ Component

- **`displayProperty`**: ถ้าส่ง `"name"` จะแสดงรายชื่อประเทศ (เช่น `Thailand`), ถ้าส่ง `"nationality"` จะแสดงสัญชาติ (เช่น `Thai`)
- Component จะดึงรูปธงชาติมาจากเว็บ `flagcdn.com` แบบอัตโนมัติตาม `code` ของประเทศ
- โค้ดของ Component ในไฟล์ตัวอย่างมีการล็อคให้ประเทศรหัส `VN` (Vietnam) อยู่แสดงผลอันดับบนสุดเสมอ หากมีการนำไปใช้ในโปรเจคที่ไม่ได้เน้นกลุ่มผู้ใช้งานที่ Vietnam สามารถลบเงื่อนไข sorting ส่วนนั้นในฟังก์ชัน `useMemo` ออกได้เลย
