// CORRECT: The service receives the actor and enforces resource policy.
@UseGuards(JwtAuthGuard)
@Delete(":id")
remove(@CurrentUser() user: User, @Param("id") id: string) {
  return this.postsService.removeForActor(user.id, id);
}
