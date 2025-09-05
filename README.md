This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Color Palette (60-30-10)

This project follows a 60-30-10 color strategy to ensure visual hierarchy and consistency:

- 60% Black (`#000000`) – Primary background and base typography.
- 30% Graphite Gray (`#333333`) – Secondary elements, section backgrounds, and borders.
- 10% Fuchsia (`#C2187A`) – Buttons, icons, and accent highlights.

Implementation notes:

- Use black as the default page background and text color where high contrast is required.
- Apply graphite gray for secondary text, dividers, and neutral surfaces.
- Reserve fuchsia strictly for interactive or accent elements to maintain emphasis.

Accessibility:

- Ensure minimum contrast ratios (WCAG AA):
  - Black text on white surfaces and vice versa meet contrast by default.
  - Fuchsia accents should be paired with white text for buttons (`#C2187A` on white) or used as outlines/icons on neutral surfaces.

Example usage can be seen on the home page where the palette swatches are centered and labeled for reference.
