export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User already exists: ${email}`)
    this.name = 'UserAlreadyExistsError'
  }
}

export class UserCreationError extends Error {
  constructor() {
    super('User creation failed')
    this.name = 'UserCreationError'
  }
}

export class AuthenticationError extends Error {
  constructor() {
    super('Authentication failed')
    this.name = 'AuthenticationError'
  }
}
