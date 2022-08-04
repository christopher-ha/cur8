<img src="https://user-images.githubusercontent.com/63668974/182755808-92bd33a7-2830-4915-89b7-dc7f3d46ee80.png" width=100/>

A collaborative project management app for stylists, photographers, designers, and creative directors in the fashion industry.  
Designed + Developed by [bhris.Digital](https://bhris.digital/) [@bhris001](https://www.instagram.com/bhris001/)

https://www.cur8.world/

## Why did I create cur8?
When I worked in on-set production for campaigns and collaborated with my friends who were stylists, I realized that the creative workflow was barbaric. Typically you'd have a creative director or stylist create a moodboards and a call sheet that is sent out via e-mail. If any information was changed, the file had to be re-exported and sent out again.   

Not only was the information flow resistant to change, but the information was split across multiple files and image-based social platforms (ie. Instagram, Pinterest, Are.na, Google Images).

The problem space can be summarized as: *a scattered information flow that wasn't built for change or collaboration.*  

By using real production moodboards and call sheets from fashion stylists as reference, cur8 was designed to centralize the information flow and provide stylists with tools that let them focus less on formatting and more on creating. 

## Technology Stack
- Next.js (Serverless Full Stack)
- SASS (Styling)
- Vercel (Deployment)
- Prisma (Query)
- PostgreSQL (Database)
- Supabase (Database Deployment)
- NextAuth (Authentication)
- SendGrid (Email API)
- AWS (Image Storage & Cloud Computing)
- Figma (Product Design)
- Notion (Project Planning)

## Pages
- Campaigns
- Moodboard
- Wardrobe
- Looks Builder
- Manage Team
- Call Sheet

## Special Features
- Passwordless Authentication (NextAuth)
- AI Assisted Image Background Remover (rembg / u2-net)
- Instant Image & Text Upload for Moodboarding
  - File Picker
  - Copy & Paste
  - Drag & Drop
  - Screenshots
  - Image URLs


## Production
Created with create-next-app (Next.js) using serverless file architecture. API routes require no servers to access data.  
AWS handles image storage (S3 Bucket) for all image uploads and cloud computing (EC2 Instances) for the rembg server.  
**ENV is required so this most likely will not run if downloaded locally.**

### Commands
`npm run dev (local)`
`vercel dev (vercel)`
