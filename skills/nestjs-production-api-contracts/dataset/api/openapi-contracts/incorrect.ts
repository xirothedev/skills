// INCORRECT: Untyped payloads produce weak validation and vague OpenAPI schemas.
@Post()
create(@Body() body: any) {
  return this.usersService.create(body);
}
