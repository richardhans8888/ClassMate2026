import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ServiceError,
  getErrorResponse,
} from '@/lib/errors'

describe('ValidationError', () => {
  it('has status 400 and correct name', () => {
    const err = new ValidationError('bad input')
    expect(err.status).toBe(400)
    expect(err.name).toBe('ValidationError')
    expect(err.message).toBe('bad input')
    expect(err instanceof Error).toBe(true)
  })
})

describe('NotFoundError', () => {
  it('has status 404 and correct name', () => {
    const err = new NotFoundError('not found')
    expect(err.status).toBe(404)
    expect(err.name).toBe('NotFoundError')
    expect(err.message).toBe('not found')
  })
})

describe('ForbiddenError', () => {
  it('has status 403 and correct name', () => {
    const err = new ForbiddenError('forbidden')
    expect(err.status).toBe(403)
    expect(err.name).toBe('ForbiddenError')
  })
})

describe('ServiceError', () => {
  it('has status 500 and correct name', () => {
    const err = new ServiceError('service failed')
    expect(err.status).toBe(500)
    expect(err.name).toBe('ServiceError')
  })
})

describe('getErrorResponse', () => {
  it('maps ValidationError to 400', () => {
    const { message, status } = getErrorResponse(new ValidationError('invalid'))
    expect(status).toBe(400)
    expect(message).toBe('invalid')
  })

  it('maps NotFoundError to 404', () => {
    const { message, status } = getErrorResponse(new NotFoundError('missing'))
    expect(status).toBe(404)
    expect(message).toBe('missing')
  })

  it('maps ForbiddenError to 403', () => {
    const { status } = getErrorResponse(new ForbiddenError('no access'))
    expect(status).toBe(403)
  })

  it('maps ServiceError to 500', () => {
    const { status } = getErrorResponse(new ServiceError('boom'))
    expect(status).toBe(500)
  })

  it('maps unknown error to 500 with generic message', () => {
    const { message, status } = getErrorResponse(new Error('anything'))
    expect(status).toBe(500)
    expect(message).toBe('Internal server error')
  })

  it('maps non-Error values to 500', () => {
    const { status } = getErrorResponse('string error')
    expect(status).toBe(500)
  })
})
