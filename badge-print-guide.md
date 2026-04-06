# Badge Preview / Print Guide

คู่มือนี้สรุปวิธีนำระบบ `preview badge` และ `print badge` จากโปรเจกต์นี้ไปใช้ในโปรเจกต์อื่น รวมถึงบอกว่ารูปพื้นหลัง badge ใน preview มาจากไหน

## โครงสร้างที่ใช้ในโปรเจกต์นี้

ระบบ badge ปัจจุบันแยกเป็น 2 ส่วนหลัก

1. `Preview badge`
   ใช้คอมโพเนนต์ React ชื่อ `ConfirmationBadge`

ไฟล์:

- `src/components/confirmation-badge.tsx`

2. `Print / Preview in new window`
   ใช้ helper กลางใน `src/lib/badge-template.ts`

ไฟล์:

- `src/lib/badge-template.ts`

ภายในไฟล์นี้มีสิ่งสำคัญดังนี้

- `BADGE_TEMPLATE`
  ใช้เก็บค่าตำแหน่ง ขนาด และ spacing ของ badge ทั้งหมด
- `getBadgeQrUrl(registrationCode)`
  ใช้สร้าง URL ของ QR code
- `buildBadgeHtml(data)`
  ใช้สร้าง HTML ของ badge 1 ใบ
- `buildBadgePrintDocument(title, badges)`
  ใช้สร้าง HTML document สำหรับพิมพ์
- `openBadgePreviewWindow(title, badges)`
  ใช้เปิดหน้าต่าง preview
- `openBadgePrintWindow(title, badges)`
  ใช้เปิดหน้าต่าง print

## รูปพื้นหลัง badge ใน preview มาจากไหน

ตอนนี้รูปพื้นหลัง badge ในทั้ง preview และ print อ้างอิงจากค่าเดียวกันใน:

- `src/lib/badge-template.ts`

ค่าปัจจุบันคือ:

```ts
backgroundImageUrl: "https://static.expoflow.co/img/badge-preview.png";
```

หมายความว่า:

- preview badge บนหน้าเว็บใช้รูปจาก URL นี้
- print document ก็ใช้ URL เดียวกัน
- ถ้าจะเปลี่ยนพื้นหลัง badge ให้เปลี่ยนที่ `BADGE_TEMPLATE.backgroundImageUrl` จุดเดียว

## วิธีนำไปใช้ในโปรเจกต์อื่น

คัดลอกไฟล์หลัก 2 ไฟล์นี้ไปก่อน

- `src/lib/badge-template.ts` - มีแล้ว
- `src/components/confirmation-badge.tsx` - มีแล้ว

จากนั้นตรวจให้โปรเจกต์ใหม่มี dependency และข้อมูลต่อไปนี้

สิ่งที่ต้องมี:

- React / Next.js หรือ React app ที่รองรับ client component
- ฟอนต์ที่ต้องการใช้กับ badge
- ข้อมูลประเทศ ถ้าจะใช้ `countryCode` แล้วแปลงเป็นชื่อประเทศเหมือนโปรเจกต์นี้

ถ้าโปรเจกต์ใหม่ไม่มี `@/mock` หรือไม่มี list ประเทศ:

- แก้ `ConfirmationBadge` ให้รับ `countryLabel` ตรง ๆ
- หรือส่งชื่อประเทศมาแทน code

## วิธีใช้ Preview Badge

ในโปรเจกต์นี้ preview badge ใช้แบบนี้:

```tsx
<ConfirmationBadge
  firstName="John"
  lastName="Doe"
  companyName="Expo Flow"
  countryCode="TH"
  registrationCode="ABCD1234"
  category="VISITOR"
  position="MANAGER"
/>
```

Props ที่ใช้จริงตอนนี้มี:

- `firstName`
- `lastName`
- `companyName`
- `countryCode`
- `registrationCode`
- `category`
- `position`

ถ้าโปรเจกต์ใหม่ไม่ต้องแปลง country code:

- แนะนำให้แก้คอมโพเนนต์ให้รับ `countryLabel` ตรง ๆ จะง่ายกว่า

## วิธีใช้ Print Badge

ในโปรเจกต์นี้เวลาอยากสั่งพิมพ์ badge 1 ใบ ใช้ `openBadgePrintWindow(...)`

ตัวอย่าง:

```ts
import { openBadgePrintWindow } from "@/lib/badge-template";

openBadgePrintWindow("Print Badge - ABCD1234", [
  {
    firstName: "John",
    lastName: "Doe",
    position: "MANAGER",
    companyName: "Expo Flow",
    countryLabel: "THAILAND",
    registrationCode: "ABCD1234",
    category: "VISITOR",
  },
]);
```

ถ้าต้องการพิมพ์หลายใบ:

```ts
openBadgePrintWindow("Print All Badges", [
  {
    firstName: "John",
    lastName: "Doe",
    position: "MANAGER",
    companyName: "Expo Flow",
    countryLabel: "THAILAND",
    registrationCode: "ABCD1234",
    category: "VISITOR",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    position: "DIRECTOR",
    companyName: "Expo Flow",
    countryLabel: "VIETNAM",
    registrationCode: "EFGH5678",
    category: "VISITOR",
  },
]);
```

ระบบจะ:

- เปิดหน้าต่างใหม่
- render badge ตาม template เดียวกัน
- สั่ง `window.print()` อัตโนมัติ

## วิธีใช้ Preview Window

ถ้าต้องการเปิดหน้าต่าง preview โดยยังไม่สั่ง print ทันที ให้ใช้:

```ts
import { openBadgePreviewWindow } from "@/lib/badge-template";

openBadgePreviewWindow("Preview Badge - ABCD1234", [
  {
    firstName: "John",
    lastName: "Doe",
    position: "MANAGER",
    companyName: "Expo Flow",
    countryLabel: "THAILAND",
    registrationCode: "ABCD1234",
    category: "VISITOR",
  },
]);
```

## จุดที่ควรปรับเมื่อย้ายไปโปรเจกต์ใหม่

ส่วนที่มักต้องปรับมีดังนี้

1. Background badge

- ปรับที่ `BADGE_TEMPLATE.backgroundImageUrl`

2. ขนาด badge

- ปรับที่ `BADGE_TEMPLATE.pageSize`
- `BADGE_TEMPLATE.width`
- `BADGE_TEMPLATE.height`

3. ตำแหน่งข้อความ

- `BADGE_TEMPLATE.headerSpacerHeight`
- `BADGE_TEMPLATE.contentAreaHeight`
- `BADGE_TEMPLATE.contentPadding`
- `BADGE_TEMPLATE.footerPaddingTop`

4. QR code

- ปรับที่ `getBadgeQrUrl()`
- ตอนนี้ใช้บริการ:

```ts
https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=...
```

ถ้าโปรเจกต์ใหม่ต้องการใช้ QR provider ของตัวเอง ให้แก้ที่ function นี้จุดเดียว

5. ฟอนต์

- print document ใช้ Google Font `Montserrat`
- preview component ใช้ `var(--font-montserrat), sans-serif`

ถ้าโปรเจกต์ใหม่ไม่มี font นี้:

- เปลี่ยน font ใน `ConfirmationBadge`
- และเปลี่ยน font link / font-family ใน `buildBadgePrintDocument()`

## ข้อดีของโครงนี้

- preview และ print ใช้ layout เดียวกัน
- QR ใช้ URL generator เดียวกัน
- เปลี่ยนตำแหน่ง badge จากที่เดียวได้
- เปลี่ยน background จากที่เดียวได้
- ใช้งานซ้ำในหลายหน้า หรือหลายโปรเจกต์ได้ง่าย

## ข้อควรระวัง

- ถ้าโปรเจกต์ใหม่ block external image URL:
  background badge และ QR จาก URL ภายนอกอาจไม่ขึ้น
- ถ้าจะให้เสถียรที่สุดใน production:
  แนะนำให้เก็บ background badge ไว้ใน `public/` ของโปรเจกต์
- ถ้า browser หรือ printer มีการ scale page อัตโนมัติ:
  ตำแหน่งอาจคลาดได้ ควรตั้งค่า print ให้ scale 100%

## สรุปสั้น

ถ้าจะย้ายไปโปรเจกต์อื่น ให้ย้ายอย่างน้อย 2 ไฟล์นี้:

- `src/lib/badge-template.ts`
- `src/components/confirmation-badge.tsx`

และถ้าจะถามว่า background badge ใน preview มาจากไหน:

- มาจาก `BADGE_TEMPLATE.backgroundImageUrl`
- ค่าปัจจุบันคือ `https://static.expoflow.co/img/badge-preview.png`
