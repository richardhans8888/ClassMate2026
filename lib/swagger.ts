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
  paths: {},
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
