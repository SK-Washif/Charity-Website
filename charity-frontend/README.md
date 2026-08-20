# charity-frontend

Next.js (JavaScript/JSX) + Tailwind + DaisyUI frontend for **ঐক্যতান ফাউন্ডেশন** —
পাবলিক সাইট (একটি সিঙ্গেল-পেজ হোম) + অ্যাডমিন প্যানেল, একই app।

## চালানোর নিয়ম (আপনার নিজের মেশিনে)

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_BASE_URL সেট করুন
npm run dev
```

তারপর http://localhost:3000

## কাঠামো

- **পাবলিক সাইট** (`/`) — সিঙ্গেল পেজ: Hero, আমাদের কথা, সেবাসমূহ, গ্যালারি,
  নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প (প্রিভিউ), যোগাযোগ — সবকিছু একই হোম
  পেজে স্ক্রল করে দেখা যায়। নেভবারের প্রতিটি লিংক `/#id` আকারে ওই সেকশনে
  স্মুথ-স্ক্রল করে।
- **শিক্ষাবৃত্তি আবেদন** (`/scholarship`, `/scholarship/print`) — যেহেতু এটা
  একটা প্রকৃত ফর্ম + সাবমিশন + প্রিন্টেবল-কপি ওয়ার্কফ্লো, তাই এটা আলাদা
  রুটেই রাখা হয়েছে (একটা প্রিভিউ সেকশন হোম পেজেও আছে, যেখান থেকে এখানে
  আসা যায়)।
- **অ্যাডমিন প্যানেল** (`/admin/...`) — লগইন গার্ডেড (`useAuth` +
  `/admin/layout.jsx`)। সাইডবার নেভিগেশন সহ ড্যাশবোর্ড, About/Contact এডিট
  ফর্ম, Services ও Gallery-এর জন্য add/edit/delete UI। এখন client-side
  state দিয়ে কাজ করে — ব্যাকএন্ড রেডি হলে `lib/api.js` / `lib/auth.js`-এর
  মাধ্যমে real API-তে যুক্ত হবে (প্রতিটা ফাইলে সংশ্লিষ্ট `TODO` কমেন্ট আছে)।

## টেক স্ট্যাক

- Next.js 14 (App Router) — **JavaScript/JSX**, TypeScript নেই
- Tailwind CSS + DaisyUI (custom `charity` theme, `tailwind.config.js`)
- Fonts: Spectral (display) / Work Sans (body) / IBM Plex Mono (numbers, ledger stats)
- Design tokens: kraft/paper/ink/marigold/stamp/line
- Path alias: `@/*` → জেনারেট হয়েছে `jsconfig.json` দিয়ে
- `lib/api.js`, `lib/auth.js`, `hooks/useAuth.js` — backend সংযোগের জন্য
  প্রস্তুত কাঠামো

## পরের ধাপ

- ব্যাকএন্ড রেডি হলে অ্যাডমিন ফর্মগুলোর mock state real `/api/...` কলে
  বদলানো
- Gallery-তে সরাসরি ImageBB আপলোড ইন্টিগ্রেশন (এখন শুধু URL ফিল্ড দিয়ে যোগ
  করা যায়)
