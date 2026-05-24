// INCORRECT: Raw upload reaches storage without validation.
@Post("upload")
@UseInterceptors(FileInterceptor("file"))
upload(@UploadedFile() file: Express.Multer.File) {
  return this.files.save(file);
}
