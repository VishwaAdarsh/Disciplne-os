# ARCH-008 — File Storage & Media Architecture Blueprint

**Document ID:** ARCH-008  
**Title:** File Storage & Media Architecture Blueprint  
**Priority:** ⭐⭐⭐⭐⭐⭐⭐⭐  
**Version:** 1.0  
**Status:** Approved & Active  

---

## Out of Scope Observations

> [!NOTE]
> **OUT OF SCOPE OBSERVATION 01**: Existing backend route handlers do not yet mount cloud storage provider adapters or automated pre-signed URL generation middleware. Per mandatory guardrail instructions, frontend UI components, React code, existing database schemas (`ARCH-001`), and API contracts (`ARCH-002`) remain untouched. This blueprint defines the complete backend File Storage & Media Architecture specification.

---

## 1. Vision

The file storage system for **DisciplineOS** must strictly be:
- **Secure**: Protected by strict ownership verification and short-lived signed URLs.
- **Scalable**: Decoupled from application compute servers to support petabytes of asset data.
- **Fast**: Distributed globally via Edge Content Delivery Networks (CDNs).
- **Cloud-Native**: Stored on elastic object storage providers.
- **Provider-Independent**: Abstracted behind an environment-configurable adapter pattern.

> **Fundamental Principle**: The application MUST NEVER store uploaded binary files inside the local server file system or project source code repository in production environments.

---

## 2. Core Storage Architecture Pipeline

```
Client ──► Upload API ──► Server Validation ──► Image Optimization ──► Cloud Storage ──► Metadata DB (files) ──► Response
```

Every uploaded asset flows through this standardized pipeline.

---

## 3. Supported Media Types & Roadmap

### 3.1 Current Supported Media
- **Profile Avatars**: User profile photos (`avatars/`)
- **Goal Attachments**: Goal reference images and milestone assets (`goals/`)
- **Journal Attachments**: Images attached to daily reflections (`journals/`)
- **AI Report PDFs**: Generated weekly/monthly PDF reports (`reports/`)
- **CSV Exports**: Exported user telemetry data files (`exports/`)

### 3.2 Future Media Roadmap
- Video logs & workout demonstrations (`videos/`)
- Voice reflections (`audio/`)
- Meal & nutrition photos for AI Vision parsing (`nutrition/`)
- AI Vision uploads (`ai_vision/`)

---

## 4. Storage Provider Abstraction Layer

The application utilizes a unified storage interface (`IStorageProvider`) configured via environment variables:

| Environment | Provider Identifier | Target Storage Mechanism |
| :--- | :--- | :--- |
| **Development** | `local` | Local development storage (`/storage/temp/`) |
| **Production (AWS)** | `s3` | Amazon Simple Storage Service (S3) |
| **Production (Cloudinary)**| `cloudinary` | Cloudinary Asset Management |
| **Production (Azure)** | `azure` | Azure Blob Storage |
| **Production (GCS)** | `gcs` | Google Cloud Storage |

### Environment Configuration Example
```env
STORAGE_PROVIDER=s3
AWS_S3_BUCKET=disciplineos-media-production
AWS_REGION=us-east-1
CDN_BASE_URL=https://cdn.disciplineos.app
```

---

## 5. End-to-End Upload Pipeline Architecture

```
User Selects File ──► Client Format Check ──► POST /api/v1/files/upload ──► Backend Validation ──► Image Optimization ──► Upload to Cloud Bucket ──► Write Record to 'files' Table ──► Return File Metadata & URL
```

1. **Client Validation**: Check file extension and size client-side before sending.
2. **Server Validation**: Validate actual MIME type header, file signature, and size server-side.
3. **Image Optimization**: Compress images and strip unnecessary EXIF metadata.
4. **Cloud Upload**: Store binary stream into object storage.
5. **Metadata Save**: Insert record into `files` table matching `ARCH-001`.
6. **Response**: Return JSON payload containing `id`, `filename`, `url`, `sizeBytes`, `mimeType`.

---

## 6. File Validation & Size Limits

Backend middleware validates every file upload against strict constraints:

| Media Type | Max Size Limit | Permitted MIME Types / Extensions |
| :--- | :--- | :--- |
| **Profile Avatar** | **5 MB** | `image/jpeg`, `image/png`, `image/webp` (`.jpg`, `.jpeg`, `.png`, `.webp`) |
| **Goal / Journal Image** | **10 MB** | `image/jpeg`, `image/png`, `image/webp` (`.jpg`, `.jpeg`, `.png`, `.webp`) |
| **Documents / Exports** | **25 MB** | `application/pdf`, `text/plain`, `text/csv`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| **PDF Reports** | **50 MB** | `application/pdf` (`.pdf`) |

> **Rule**: Any upload with an unapproved MIME type or exceeding size limits is immediately rejected with HTTP `422 Unprocessable Entity`.

---

## 7. Image Optimization Engine

When an image file is uploaded, the backend storage service automatically processes it before uploading to cloud storage:

1. **Compression**: Compress image quality using lossless algorithms (WebP conversion default).
2. **Resizing**: Generate max dimensions (e.g. `2048x2048` max for main image; `256x256` for avatar thumbnail).
3. **EXIF Stripping**: Strip sensitive EXIF metadata (GPS coordinates, camera serial numbers) to protect user privacy.
4. **Aspect Ratio**: Preserve original aspect ratio during resize operations.

---

## 8. Database Metadata Storage Model

The database ONLY stores file metadata in the `files` table (`ARCH-001`). **Raw file binary content is NEVER stored in the database.**

```prisma
model File {
  id              String    @id @default(uuid())
  ownerId         String
  user            User      @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  filename        String
  url             String
  mimeType        String
  sizeBytes       Int
  storageProvider String    @default("s3")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?

  @@index([ownerId])
}
```

---

## 9. Logical Bucket & Folder Hierarchy

Object keys in cloud storage follow a logical namespace structure:

```
s3://disciplineos-media-production/
├── avatars/
│   └── {userId}/avatar_{timestamp}.webp
├── goals/
│   └── {userId}/{goalId}/{fileId}.webp
├── journals/
│   └── {userId}/{journalId}/{fileId}.webp
├── reports/
│   └── {userId}/reports_{period}_{timestamp}.pdf
├── exports/
│   └── {userId}/export_{timestamp}.csv
└── temp/
    └── {fileId}.tmp
```

---

## 10. Access Control & Pre-Signed Download URLs

Every file has a designated scope:
- **Public Assets** (e.g. Public avatars): Served directly via Edge CDN (`https://cdn.disciplineos.app/avatars/...`).
- **Private Assets** (e.g. Journal attachments, AI reports, CSV exports): Protected by authentication.

### Secure Download Workflow
```
Client Requests Private File ──► Authentication & Ownership Check ──► Generate Pre-Signed URL (15-min TTL) ──► Return Temporary URL to Client ──► Direct Download from Cloud Storage
```

> **Security Guarantee**: Permanent private cloud URLs are NEVER exposed to client applications. Private files are accessed strictly via temporary HMAC-signed URLs expiring after 15 minutes.

---

## 11. CDN Edge Distribution Strategy

- Public assets (avatars, static report templates, web graphics) are cached globally at edge nodes (AWS CloudFront / Cloudflare CDN).
- Edge caching headers: `Cache-Control: public, max-age=31536000, immutable`.
- Reduces origin server bandwidth and ensures sub-100ms asset loading worldwide.

---

## 12. Temporary Export Storage & Scheduled Cleanup Policy

- **Temporary Uploads (`temp/`)**: Unfinished or interrupted uploads are purged after **24 hours**.
- **Export Files (`exports/`)**: Generated CSV data exports expire and are deleted after **7 days**.
- **Automated Cleanup Job**: A daily background cron job scans the `temp/` folder and soft-deleted database records (`deletedAt IS NOT NULL`) to purge orphaned storage objects.

---

## 13. File Versioning Strategy

- Updating a profile avatar or goal attachment uploads a new version with a new storage key.
- The `files` record is updated to point to the new URL, while the previous version is marked for soft deletion (`deletedAt`).
- Ensures existing client caches or report references do not break during asset updates.

---

## 14. Security & Malware Guardrails

1. **Authentication Required**: All file upload endpoints require valid JWT Bearer tokens.
2. **Owner Isolation**: Users can only read/write files where `ownerId === req.userId`.
3. **File Signature Checking**: Verify actual binary magic bytes (e.g. `FF D8 FF` for JPEG) to prevent malicious files disguised with valid extensions.
4. **Zero Repo Storage**: `.gitignore` rules prevent local storage uploads from being checked into source control.

---

## 15. Monitoring & Observability Metrics

The storage service tracks execution telemetry:
- `storage_upload_success_total`: Total successful uploads.
- `storage_upload_failed_total`: Total failed uploads.
- `storage_total_bytes_stored`: Cumulative storage volume used.
- `storage_bandwidth_bytes`: Total bandwidth consumed by downloads.
- `storage_validation_rejected_total`: Total files rejected by size/MIME rules.

---

## 16. Disaster Recovery & Backup Strategy

- **Object Versioning**: Cloud bucket versioning enabled to recover from accidental deletions.
- **Cross-Region Replication**: Critical user assets replicated across secondary geographic cloud regions.
- **Lifecycle Policies**: Automated transition of older reports (> 365 days) to low-cost cold storage (S3 Glacier / GCS Archive).

---

## 17. Future Integrations Roadmap

The storage architecture supports seamless addition of third-party cloud drives:
- Google Drive Export / Import
- Dropbox Synchronization
- Apple iCloud Sync
- AI Vision Media Parsing (sending food/workout images to AI vision models)

---

## 18. Success Criteria

The File Storage & Media Architecture successfully fulfills:
- ✅ Secure, cloud-native storage pipeline independent of local server storage.
- ✅ Provider abstraction layer supporting S3, Cloudinary, Azure Blob, and GCS.
- ✅ Strict validation rules (Avatar 5MB, Images 10MB, Documents 25MB, Reports 50MB).
- ✅ Image optimization, WebP conversion, and EXIF metadata stripping.
- ✅ Short-lived pre-signed download URLs for private assets and CDN edge caching for public assets.
- ✅ Scheduled garbage collection cleanup for temporary and orphaned files.
