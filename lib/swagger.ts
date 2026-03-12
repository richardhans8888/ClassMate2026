export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'ClassMate2026 API',
    version: '1.0.0',
    description:
      'ClassMate2026 REST API. Phase 1 covers 10 routes (23 operations). ' +
      '6 deferred routes are documented in docs/swagger-openapi-prd.md Section 4.2.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local development' },
    { url: 'https://classmate2026.vercel.app', description: 'Production' },
  ],
  tags: [
    { name: 'bookings', description: 'Booking management' },
    { name: 'tutors', description: 'Tutor discovery and registration' },
    { name: 'reviews', description: 'Tutor reviews' },
    { name: 'study-groups', description: 'Study group management' },
    { name: 'sessions', description: 'AI tutor chat sessions' },
    { name: 'user', description: 'User profile and XP' },
    { name: 'notifications', description: 'In-app notifications' },
  ],
  paths: {
    '/api/bookings': {
      get: {
        tags: ['bookings'],
        summary: 'List bookings for a user',
        description:
          'Returns bookings for the given user. When role=tutor, if no tutor profile exists for the user, returns { bookings: [] } with 200 (not a 404).',
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: true,
            description: 'ID of the requesting user',
            schema: { type: 'string' },
          },
          {
            name: 'role',
            in: 'query',
            required: false,
            description: "Filter bookings by the user's role in the booking. Defaults to student.",
            schema: { type: 'string', enum: ['student', 'tutor'] },
          },
        ],
        responses: {
          200: {
            description: 'Bookings retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    bookings: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Booking' },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['bookings'],
        summary: 'Create a booking',
        description: 'Awards 50 XP to the student. Sends a notification to the tutor.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tutorId', 'studentId', 'subject', 'scheduledAt'],
                properties: {
                  tutorId: { type: 'string' },
                  studentId: { type: 'string' },
                  subject: { type: 'string' },
                  scheduledAt: { type: 'string', format: 'date-time', description: 'ISO 8601 date-time string' },
                  durationMinutes: { type: 'number', description: 'Defaults to 60' },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Booking created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    booking: { $ref: '#/components/schemas/Booking' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['bookings'],
        summary: 'Update booking status',
        description:
          'Sends a status-change notification to the student. When status becomes "completed": awards 100 XP to the student and 75 XP to the tutor (if userId is provided).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['bookingId', 'status'],
                properties: {
                  bookingId: { type: 'string' },
                  status: {
                    type: 'string',
                    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
                  },
                  userId: {
                    type: 'string',
                    description: "Tutor's user ID. Required when status=completed to award tutor XP.",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Booking updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    booking: { $ref: '#/components/schemas/Booking' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/tutors': {
      get: {
        tags: ['tutors'],
        summary: 'List tutors',
        description: 'All parameters are optional filters. Results are ordered by rating descending.',
        parameters: [
          {
            name: 'subject',
            in: 'query',
            required: false,
            description: 'Filter to tutors who teach this subject',
            schema: { type: 'string' },
          },
          {
            name: 'search',
            in: 'query',
            required: false,
            description: 'Case-insensitive name filter applied after the database query',
            schema: { type: 'string' },
          },
          {
            name: 'available',
            in: 'query',
            required: false,
            description: 'Pass "true" to filter to available tutors only (is_available = true)',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Tutors retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tutors: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Tutor' },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['tutors'],
        summary: 'Register or update a tutor profile',
        description:
          'Upserts the tutor record. If the user already has a tutor record it is updated; otherwise a new record is created and the user\'s role in user_profiles is set to "tutor".',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'subjects'],
                properties: {
                  userId: { type: 'string' },
                  subjects: { type: 'array', items: { type: 'string' } },
                  hourlyRate: { type: 'number' },
                  bio: { type: 'string' },
                  availability: { type: 'object', description: 'Free-form availability schedule' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Tutor profile upserted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tutor: { $ref: '#/components/schemas/Tutor' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/study-groups': {
      get: {
        tags: ['study-groups'],
        summary: 'List study groups',
        description:
          'Returns public groups by default. When myGroups=true, returns all groups the user belongs to including private ones they are a member of.',
        parameters: [
          {
            name: 'subject',
            in: 'query',
            required: false,
            description: 'Exact-match filter on subject',
            schema: { type: 'string' },
          },
          {
            name: 'userId',
            in: 'query',
            required: false,
            description: 'Required when myGroups=true',
            schema: { type: 'string' },
          },
          {
            name: 'myGroups',
            in: 'query',
            required: false,
            description: 'Pass "true" to return only groups the requesting user belongs to',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Study groups retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    groups: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/StudyGroup' },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['study-groups'],
        summary: 'Create a study group',
        description: 'Auto-adds the owner as a member with role "owner". Awards 30 XP to the owner.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'subject', 'ownerId'],
                properties: {
                  name: { type: 'string' },
                  subject: { type: 'string' },
                  ownerId: { type: 'string' },
                  description: { type: 'string' },
                  maxMembers: { type: 'number', description: 'Defaults to 10' },
                  isPrivate: {
                    type: 'boolean',
                    description: 'When true, the group requires an invite code to join. Defaults to false.',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Study group created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    group: { $ref: '#/components/schemas/StudyGroup' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['study-groups'],
        summary: 'Delete a study group',
        description:
          'Only succeeds if the requesting user is the group owner (enforced by owner_id = userId check in the database query).',
        parameters: [
          {
            name: 'groupId',
            in: 'query',
            required: true,
            description: 'UUID of the study group',
            schema: { type: 'string' },
          },
          {
            name: 'userId',
            in: 'query',
            required: true,
            description: 'Must be the group owner',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Study group deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameters',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/study-groups/{groupId}/join': {
      post: {
        tags: ['study-groups'],
        summary: 'Join a study group',
        description:
          'Handles both public and private (invite-code-gated) groups. Awards 20 XP to the joining user. Notifies the group owner.',
        parameters: [
          {
            name: 'groupId',
            in: 'path',
            required: true,
            description: 'UUID of the study group',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  userId: { type: 'string' },
                  inviteCode: {
                    type: 'string',
                    description: 'Required only if the group is private',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Joined successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request — (1) missing userId ("userId required"); (2) already a member ("Already a member"); (3) group at capacity ("Group is full")',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          403: {
            description: 'Invalid invite code',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Group not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['study-groups'],
        summary: 'Leave a study group',
        parameters: [
          {
            name: 'groupId',
            in: 'path',
            required: true,
            description: 'UUID of the study group',
            schema: { type: 'string' },
          },
          {
            name: 'userId',
            in: 'query',
            required: true,
            description: 'UUID of the user leaving the group',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Left successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/study-groups/{groupId}/messages': {
      get: {
        tags: ['study-groups'],
        summary: 'Get group messages',
        description:
          'Returns the most recent 100 messages ordered by created_at ascending. Each message includes the sender\'s display_name and avatar_url via a nested user_profiles join.',
        parameters: [
          {
            name: 'groupId',
            in: 'path',
            required: true,
            description: 'UUID of the study group',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Messages retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    messages: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/StudyGroupMessage' },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['study-groups'],
        summary: 'Send a group message',
        description: 'Membership is verified before insertion. Awards 5 XP to the sender.',
        parameters: [
          {
            name: 'groupId',
            in: 'path',
            required: true,
            description: 'UUID of the study group',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'content'],
                properties: {
                  userId: { type: 'string' },
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Message sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { $ref: '#/components/schemas/StudyGroupMessage' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          403: {
            description: 'You are not a member of this group',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/tutors/reviews': {
      get: {
        tags: ['reviews'],
        summary: 'Get reviews for a tutor',
        description: 'Returns all reviews ordered by created_at descending.',
        parameters: [
          {
            name: 'tutorId',
            in: 'query',
            required: true,
            description: 'ID of the tutor',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Reviews retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    reviews: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/TutorReview' },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['reviews'],
        summary: 'Submit a tutor review',
        description:
          'One review per student per tutor is enforced. Awards 25 XP to the student. ' +
          '400 errors: (1) missing fields — "tutorId, studentId, rating required"; (2) duplicate review — "You have already reviewed this tutor".',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tutorId', 'studentId', 'rating'],
                properties: {
                  tutorId: { type: 'string' },
                  studentId: { type: 'string' },
                  rating: { type: 'number', description: 'Numeric rating 1–5' },
                  comment: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Review submitted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    review: { $ref: '#/components/schemas/TutorReview' },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request — missing required fields ("tutorId, studentId, rating required") or duplicate review ("You have already reviewed this tutor")',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/sessions': {
      get: {
        tags: ['sessions'],
        summary: 'List AI chat sessions for a user',
        description:
          'Returns up to 20 sessions ordered by updated_at descending. Each session includes a message count via a nested chat_messages aggregate.',
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: true,
            description: 'UUID of the user',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Sessions retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    sessions: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ChatSession' },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['sessions'],
        summary: 'Create a new AI chat session',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  userId: { type: 'string' },
                  title: { type: 'string', description: 'Defaults to "New Session"' },
                  subject: { type: 'string', description: 'Defaults to "General"' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Session created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    session: { $ref: '#/components/schemas/ChatSession' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['sessions'],
        summary: 'Delete a session and its messages',
        description: 'Deletes the session record and all associated chat messages.',
        parameters: [
          {
            name: 'sessionId',
            in: 'query',
            required: true,
            description: 'UUID of the session to delete',
            schema: { type: 'string' },
          },
          {
            name: 'userId',
            in: 'query',
            required: true,
            description: 'UUID of the session owner',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Session deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameters',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/sessions/{sessionId}/messages': {
      get: {
        tags: ['sessions'],
        summary: 'Get messages for a session',
        description:
          'Returns all messages in chronological order. Ownership is verified: the session must belong to the requesting user. Returns 404 if the session does not exist or belongs to a different user.',
        parameters: [
          {
            name: 'sessionId',
            in: 'path',
            required: true,
            description: 'UUID of the chat session',
            schema: { type: 'string' },
          },
          {
            name: 'userId',
            in: 'query',
            required: true,
            description: 'UUID of the session owner',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Messages retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    messages: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ChatMessage' },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description:
              'Session not found — returned both when the session does not exist and when it belongs to a different user (PRD AC19)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/user/profile': {
      get: {
        tags: ['user'],
        summary: 'Get a user profile',
        description:
          'Augments the raw database record with three computed XP progress fields: xpProgress (xp % 500), xpForNextLevel (always 500), and progressPercent (integer percentage toward next level).',
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: true,
            description: 'UUID of the user',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    profile: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['user'],
        summary: 'Update a user profile',
        description:
          'Only the following fields are updated: display_name, bio, university, major, avatar_url. Any other fields in the request body are silently ignored by an allow-list filter in the route handler.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  userId: { type: 'string' },
                  display_name: { type: 'string', description: 'Allow-listed field' },
                  bio: { type: 'string', description: 'Allow-listed field' },
                  university: { type: 'string', description: 'Allow-listed field' },
                  major: { type: 'string', description: 'Allow-listed field' },
                  avatar_url: { type: 'string', description: 'Allow-listed field' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    profile: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },

    '/api/notifications': {
      get: {
        tags: ['notifications'],
        summary: 'List notifications for a user',
        description: 'Returns up to 30 notifications ordered by created_at descending.',
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: true,
            description: 'UUID of the user',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Notifications retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    notifications: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Notification' },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['notifications'],
        summary: 'Mark notifications as read',
        description:
          'Supports marking a single notification (via notificationId) or all notifications (via markAllRead: true). If markAllRead is true, notificationId is ignored.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  userId: { type: 'string' },
                  notificationId: {
                    type: 'string',
                    description: 'UUID of a specific notification to mark as read. Ignored if markAllRead is true.',
                  },
                  markAllRead: {
                    type: 'boolean',
                    description: "Pass true to mark all of the user's notifications as read.",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Notifications marked as read',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required fields',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['notifications'],
        summary: 'Delete a notification',
        parameters: [
          {
            name: 'notificationId',
            in: 'query',
            required: true,
            description: 'UUID of the notification to delete',
            schema: { type: 'string' },
          },
          {
            name: 'userId',
            in: 'query',
            required: true,
            description: 'UUID of the owning user',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Notification deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          400: {
            description: 'Missing required query parameters',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string' },
        },
      },

      UserProfileBasic: {
        type: 'object',
        required: ['display_name'],
        properties: {
          display_name: { type: 'string' },
          avatar_url: { type: 'string', nullable: true },
        },
      },

      UserProfile: {
        type: 'object',
        required: [
          'id',
          'display_name',
          'role',
          'xp',
          'level',
          'xpProgress',
          'xpForNextLevel',
          'progressPercent',
        ],
        properties: {
          id: { type: 'string' },
          display_name: { type: 'string' },
          role: { type: 'string' },
          xp: { type: 'number' },
          level: { type: 'number' },
          xpProgress: {
            type: 'number',
            description: 'Computed field — XP earned within the current level (not stored in DB)',
          },
          xpForNextLevel: {
            type: 'number',
            description: 'Computed field — total XP required to reach the next level (not stored in DB)',
          },
          progressPercent: {
            type: 'number',
            description: 'Computed field — percentage progress toward the next level (not stored in DB)',
          },
          bio: { type: 'string', nullable: true },
          university: { type: 'string', nullable: true },
          major: { type: 'string', nullable: true },
          avatar_url: { type: 'string', nullable: true },
        },
      },

      Tutor: {
        type: 'object',
        required: ['id', 'user_id', 'subjects', 'is_available', 'created_at'],
        properties: {
          id: { type: 'string' },
          user_id: { type: 'string' },
          subjects: {
            type: 'array',
            items: { type: 'string' },
          },
          is_available: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          hourly_rate: { type: 'number', nullable: true },
          bio: { type: 'string', nullable: true },
          availability: { type: 'object', nullable: true },
          rating: { type: 'number', nullable: true },
          user_profiles: {
            type: 'object',
            properties: {
              display_name: { type: 'string' },
              avatar_url: { type: 'string', nullable: true },
              university: { type: 'string', nullable: true },
              major: { type: 'string', nullable: true },
            },
          },
        },
      },

      TutorReview: {
        type: 'object',
        required: ['id', 'tutor_id', 'student_id', 'rating', 'created_at'],
        properties: {
          id: { type: 'string' },
          tutor_id: { type: 'string' },
          student_id: { type: 'string' },
          rating: { type: 'number' },
          created_at: { type: 'string', format: 'date-time' },
          comment: { type: 'string', nullable: true },
          user_profiles: {
            type: 'object',
            properties: {
              display_name: { type: 'string' },
              avatar_url: { type: 'string', nullable: true },
            },
          },
        },
      },

      Booking: {
        type: 'object',
        required: [
          'id',
          'tutor_id',
          'student_id',
          'subject',
          'scheduled_at',
          'duration_minutes',
          'status',
          'created_at',
        ],
        properties: {
          id: { type: 'string' },
          tutor_id: { type: 'string' },
          student_id: { type: 'string' },
          subject: { type: 'string' },
          scheduled_at: { type: 'string', format: 'date-time' },
          duration_minutes: { type: 'number' },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
          },
          created_at: { type: 'string', format: 'date-time' },
          notes: { type: 'string', nullable: true },
          tutors: {
            type: 'object',
            description: 'Joined tutor record — present on GET responses',
            allOf: [{ $ref: '#/components/schemas/Tutor' }],
          },
          student: {
            type: 'object',
            description: 'Joined student profile — present on GET responses',
            allOf: [{ $ref: '#/components/schemas/UserProfileBasic' }],
          },
        },
      },

      StudyGroup: {
        type: 'object',
        required: ['id', 'name', 'subject', 'owner_id', 'max_members', 'is_private', 'created_at'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          subject: { type: 'string' },
          owner_id: { type: 'string' },
          max_members: { type: 'number' },
          is_private: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          description: { type: 'string', nullable: true },
          invite_code: { type: 'string', nullable: true },
          owner: {
            type: 'object',
            allOf: [{ $ref: '#/components/schemas/UserProfileBasic' }],
          },
          study_group_members: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                count: { type: 'number' },
              },
            },
          },
        },
      },

      StudyGroupMessage: {
        type: 'object',
        required: ['id', 'group_id', 'user_id', 'content', 'created_at'],
        properties: {
          id: { type: 'string' },
          group_id: { type: 'string' },
          user_id: { type: 'string' },
          content: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          user_profiles: {
            type: 'object',
            properties: {
              display_name: { type: 'string' },
              avatar_url: { type: 'string', nullable: true },
            },
          },
        },
      },

      ChatSession: {
        type: 'object',
        required: ['id', 'user_id', 'title', 'subject', 'created_at', 'updated_at'],
        properties: {
          id: { type: 'string' },
          user_id: { type: 'string' },
          title: { type: 'string' },
          subject: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          chat_messages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                count: { type: 'number' },
              },
            },
          },
        },
      },

      ChatMessage: {
        type: 'object',
        required: ['id', 'role', 'content', 'created_at'],
        properties: {
          id: { type: 'string' },
          role: {
            type: 'string',
            enum: ['user', 'assistant'],
          },
          content: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },

      Notification: {
        type: 'object',
        required: ['id', 'user_id', 'title', 'message', 'type', 'is_read', 'created_at'],
        properties: {
          id: { type: 'string' },
          user_id: { type: 'string' },
          title: { type: 'string' },
          message: { type: 'string' },
          type: {
            type: 'string',
            enum: ['booking', 'group', 'general'],
          },
          is_read: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          link: { type: 'string', nullable: true },
        },
      },
    },
    parameters: {},
  },
}
