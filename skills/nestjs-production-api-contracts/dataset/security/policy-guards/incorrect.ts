// INCORRECT: The user is authenticated, but ownership is never checked.
@UseGuards(JwtAuthGuard)
@Delete(":id")
remove(@Param("id") id: string) {
  return this.postsService.remove(id);
}
