import type { ZodError } from 'zod'

export function zodErrorToString(error: ZodError): string {
  const first = error.issues[0]
  if (!first) return 'Validation error'
  return first.message
}

export class ValidationError extends Error {
  readonly status = 400
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  readonly status = 404
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ForbiddenError extends Error {
  readonly status = 403
  constructor(message: string) {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class ServiceError extends Error {
  readonly status = 500
  constructor(message: string) {
    super(message)
    this.name = 'ServiceError'
  }
}

export function getErrorResponse(error: unknown): { message: string; status: number } {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError ||
    error instanceof ServiceError
  ) {
    return { message: error.message, status: error.status }
  }
  return { message: 'Internal server error', status: 500 }
}
