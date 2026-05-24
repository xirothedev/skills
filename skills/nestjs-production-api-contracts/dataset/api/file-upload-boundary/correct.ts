// CORRECT: Validate file constraints before storage.
@Post("upload")
@UseInterceptors(FileInterceptor("file", uploadOptions))
upload(
  @UploadedFile(new ParseFilePipe({ validators }))
  file: Express.Multer.File,
) {
  return this.files.saveValidated(file);
}
