# Image Processing API

REST API for uploading, processing, transforming, and optimizing images using Node.js, TypeScript, Express, Multer, and Sharp.

## Features

- Single image upload
- Multiple image upload
- Responsive image generation
- Image resizing
- Format conversion
- Image quality control
- Sharpening
- Thumbnail generation
- Image metadata extraction
- Watermarking
- Input validation
- Static image delivery
- Security middleware with Helmet
- CORS support
- HTTP request logging with Morgan
- Centralized error handling

## Technologies

- Node.js
- TypeScript
- Express
- Sharp
- Multer
- Axios
- FormData
- Helmet
- CORS
- Morgan

## Project Structure

```text
image-processing-api/
├── src/
│   ├── app.ts
│   ├── config/
│   │   ├── multer.ts
│   │   └── sharp.ts
│   ├── controllers/
│   │   ├── uploadController.ts
│   │   └── processController.ts
│   ├── middleware/
│   │   └── validation.ts
│   ├── services/
│   │   └── imageService.ts
│   ├── routes/
│   │   ├── upload.ts
│   │   └── process.ts
│   └── utils/
│       └── helpers.ts
├── uploads/
├── processed/
├── cache/
├── test-api.js
├── package.json
├── tsconfig.json
└── README.md