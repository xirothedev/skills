---
title: Validate File Uploads Before Storage or Parsing
impact: HIGH
impactDescription: Prevents oversized or unsupported files from reaching storage, parsers, or downstream workers
tags: file-upload, validation, interceptors, storage, security
dataset: api/file-upload-boundary
---

## Validate File Uploads Before Storage or Parsing

File upload endpoints should enforce size, MIME, extension, and authorization before storing or parsing. Do not trust original file names or client-provided content type alone.

**Incorrect (stores raw file):**

```typescript
@Post("upload")
@UseInterceptors(FileInterceptor("file"))
upload(@UploadedFile() file: Express.Multer.File) {
  return this.files.save(file);
}
```

**Correct (validated boundary):**

```typescript
@Post("upload")
@UseInterceptors(FileInterceptor("file", uploadOptions))
upload(@UploadedFile(new ParseFilePipe({ validators })) file: Express.Multer.File) {
  return this.files.saveValidated(file);
}
```

## Source References

- https://docs.nestjs.com/techniques/file-upload
- https://docs.nestjs.com/techniques/validation
