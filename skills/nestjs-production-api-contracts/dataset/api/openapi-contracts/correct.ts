// CORRECT: DTOs and response types keep runtime validation and OpenAPI aligned.
@Post()
@ApiCreatedResponse({ type: UserResponseDto })
create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
  return this.usersService.create(dto);
}
