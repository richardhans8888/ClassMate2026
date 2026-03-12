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
