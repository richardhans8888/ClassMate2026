export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'ClassMate2026 API',
    version: '1.0.1',
    description: 'ClassMate2026 REST API - Student Community Platform. ',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local development' }],
  tags: [
    { name: 'forums', description: 'Forum posts and replies with AI moderation' },
    { name: 'study-groups', description: 'Study group management and messaging' },
    { name: 'ai', description: 'AI features: chat, moderation, summarization' },
    { name: 'sessions', description: 'AI tutor chat sessions' },
    { name: 'user', description: 'User profile and XP management' },
  ],
  security: [],
  paths: {
    // ==================== FORUMS ====================
    '/api/forums/posts': {
      get: {
        tags: ['forums'],
        summary: 'List forum posts',
        description:
          'Returns all forum posts, optionally filtered by category. Posts are ordered by creation date descending.',
        parameters: [
          {
            name: 'category',
            in: 'query',
            required: false,
            description: 'Filter posts by category (e.g., math, cs, physics)',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Array of forum posts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ForumPost' },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        tags: ['forums'],
        summary: 'Create a forum post',
        description:
          'Creates a new forum post. Content is automatically moderated using AI. ' +
          'Posts with toxic or spam content may be blocked or flagged with warnings.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content', 'category'],
                properties: {
                  title: { type: 'string', description: 'Post title' },
                  content: { type: 'string', description: 'Post content (markdown supported)' },
                  category: { type: 'string', description: 'Category (e.g., math, cs, physics)' },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Optional tags for the post',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Post created successfully',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/ForumPost' },
                    {
                      type: 'object',
                      properties: {
                        post: { $ref: '#/components/schemas/ForumPost' },
                        warning: { $ref: '#/components/schemas/ModerationWarning' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': {
            description: 'Validation error or content blocked by moderation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    moderation: { $ref: '#/components/schemas/ModerationBlock' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized - user not authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },

    '/api/forums/replies': {
      get: {
        tags: ['forums'],
        summary: 'List replies for a post',
        description:
          'Returns all replies for a specific forum post, ordered by creation date ascending.',
        parameters: [
          {
            name: 'postId',
            in: 'query',
            required: true,
            description: 'ID of the forum post',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Array of forum replies',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ForumReply' },
                },
              },
            },
          },
          '400': {
            description: 'Missing postId parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        tags: ['forums'],
        summary: 'Create a reply to a post',
        description:
          'Creates a new reply on a forum post. Content is automatically moderated using AI. ' +
          'Increments the reply count on the parent post.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['postId', 'content'],
                properties: {
                  postId: { type: 'string', description: 'ID of the post to reply to' },
                  content: { type: 'string', description: 'Reply content' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Reply created successfully',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/ForumReply' },
                    {
                      type: 'object',
                      properties: {
                        reply: { $ref: '#/components/schemas/ForumReply' },
                        warning: { $ref: '#/components/schemas/ModerationWarning' },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': {
            description: 'Validation error or content blocked by moderation',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Post not found' },
        },
      },
    },

    // ==================== AI FEATURES ====================
    '/api/moderation': {
      post: {
        tags: ['ai'],
        summary: 'Moderate content using AI',
        description:
          'Analyzes content for toxicity, spam, and inappropriate material using Groq AI. ' +
          'Returns moderation scores and recommended action (approve, warn, or block).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string', description: 'Content to analyze' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Moderation result',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ModerationResult' },
              },
            },
          },
          '400': {
            description: 'Missing content',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '500': { description: 'AI service error' },
        },
      },
    },

    '/api/summarize': {
      post: {
        tags: ['ai'],
        summary: 'Summarize a discussion thread',
        description:
          'Generates a concise 2-3 sentence summary of a discussion thread using Groq AI. ' +
          'Useful for quickly understanding long forum threads.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['thread'],
                properties: {
                  thread: { type: 'string', description: 'Thread content to summarize' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Summary result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    summary: { type: 'string', description: '2-3 sentence summary' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Missing thread content',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '500': { description: 'AI service error' },
        },
      },
    },

    '/api/chat': {
      post: {
        tags: ['ai'],
        summary: 'AI tutor chat (streaming)',
        description:
          'Sends messages to the AI tutor and receives streaming responses. ' +
          'Uses Groq LLaMA 3.3 70B model for intelligent tutoring assistance.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['messages'],
                properties: {
                  messages: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', enum: ['user', 'assistant'] },
                        content: { type: 'string' },
                      },
                    },
                    description: 'Conversation history',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Streaming response (text/event-stream)',
            content: {
              'text/event-stream': {
                schema: { type: 'string' },
              },
            },
          },
          '400': { description: 'Invalid messages format' },
          '500': { description: 'AI service error' },
        },
      },
    },

    // ==================== STUDY GROUPS ====================
    '/api/study-groups': {
      get: {
        tags: ['study-groups'],
        summary: 'List study groups',
        description: 'Returns all public study groups or groups the user is a member of.',
        responses: {
          '200': {
            description: 'Array of study groups',
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
        },
      },
      post: {
        tags: ['study-groups'],
        summary: 'Create a study group',
        description: 'Creates a new study group. Awards XP to the creator.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'subject'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  subject: { type: 'string' },
                  maxMembers: { type: 'integer' },
                  isPrivate: { type: 'boolean', default: false },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Group created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StudyGroup' },
              },
            },
          },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        tags: ['study-groups'],
        summary: 'Delete a study group',
        description: 'Deletes a study group. Only the owner can delete.',
        parameters: [
          {
            name: 'groupId',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Group deleted' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Not the group owner' },
          '404': { description: 'Group not found' },
        },
      },
    },

    '/api/study-groups/{groupId}/join': {
      post: {
        tags: ['study-groups'],
        summary: 'Join a study group',
        description: 'Adds the current user as a member. Awards XP for joining.',
        parameters: [
          {
            name: 'groupId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Successfully joined' },
          '400': { description: 'Already a member or group full' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Group not found' },
        },
      },
      delete: {
        tags: ['study-groups'],
        summary: 'Leave a study group',
        description: 'Removes the current user from the group.',
        parameters: [
          {
            name: 'groupId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Successfully left' },
          '400': { description: 'Not a member or is owner' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    '/api/study-groups/{groupId}/messages': {
      get: {
        tags: ['study-groups'],
        summary: 'Get group messages',
        description: 'Returns the message history for a study group.',
        parameters: [
          {
            name: 'groupId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Array of messages',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    messages: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/GroupMessage' },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Not a group member' },
        },
      },
      post: {
        tags: ['study-groups'],
        summary: 'Send a group message',
        description: 'Posts a message to the study group. Awards XP for participation.',
        parameters: [
          {
            name: 'groupId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Message sent',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GroupMessage' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Not a group member' },
        },
      },
    },

    // ==================== SESSIONS ====================
    '/api/sessions': {
      get: {
        tags: ['sessions'],
        summary: 'List AI chat sessions',
        description: 'Returns all chat sessions for the authenticated user.',
        responses: {
          '200': {
            description: 'Array of sessions',
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
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['sessions'],
        summary: 'Create a chat session',
        description: 'Creates a new AI tutor chat session.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', default: 'Chat Session' },
                  subject: { type: 'string', default: 'General' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Session created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChatSession' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        tags: ['sessions'],
        summary: 'Delete a chat session',
        description: 'Deletes a chat session and all its messages.',
        parameters: [
          {
            name: 'sessionId',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Session deleted' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Session not found' },
        },
      },
    },

    '/api/sessions/{sessionId}/messages': {
      get: {
        tags: ['sessions'],
        summary: 'Get session messages',
        description: 'Returns all messages in a chat session.',
        parameters: [
          {
            name: 'sessionId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Array of messages',
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
          '401': { description: 'Unauthorized' },
          '404': { description: 'Session not found' },
        },
      },
    },

    // ==================== USER ====================
    '/api/user/profile': {
      get: {
        tags: ['user'],
        summary: 'Get user profile',
        description:
          'Returns the profile for the authenticated user, including XP and level progress.',
        responses: {
          '200': {
            description: 'User profile with XP progress',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
      patch: {
        tags: ['user'],
        summary: 'Update user profile',
        description: 'Updates profile fields for the authenticated user.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  bio: { type: 'string' },
                  avatarUrl: { type: 'string' },
                  university: { type: 'string' },
                  major: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    '/api/user/xp': {
      post: {
        tags: ['user'],
        summary: 'Award XP to user',
        description: 'Awards XP points to the authenticated user for a specific action.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['actionType', 'points'],
                properties: {
                  actionType: {
                    type: 'string',
                    enum: [
                      'FORUM_POST_CREATED',
                      'FORUM_REPLY_CREATED',
                      'FORUM_UPVOTE_RECEIVED',
                      'MATERIAL_UPLOADED',
                      'STUDY_GROUP_CREATED',
                      'STUDY_GROUP_JOINED',
                      'STUDY_GROUP_MESSAGE_SENT',
                      'REVIEW_POSTED',
                    ],
                  },
                  points: { type: 'integer', minimum: 1 },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'XP awarded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    xp: { type: 'integer', description: 'New total XP' },
                    level: { type: 'integer', description: 'Current level' },
                    transaction: { $ref: '#/components/schemas/PointTransaction' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid action type or points' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // ==================== DOCS ====================
    '/api/docs': {
      get: {
        tags: ['docs'],
        summary: 'OpenAPI specification',
        description: 'Returns the OpenAPI JSON specification for this API.',
        responses: {
          '200': {
            description: 'OpenAPI spec',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
        },
      },
    },
  },

  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },

      // Forum Schemas
      ForumPost: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          category: { type: 'string' },
          upvotes: { type: 'integer', default: 0 },
          views: { type: 'integer', default: 0 },
          isAnswered: { type: 'boolean', default: false },
          repliesCount: { type: 'integer', default: 0 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          user: { $ref: '#/components/schemas/UserSummary' },
          tags: {
            type: 'array',
            items: { $ref: '#/components/schemas/ForumTag' },
          },
        },
      },

      ForumReply: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          postId: { type: 'string' },
          userId: { type: 'string' },
          content: { type: 'string' },
          upvotes: { type: 'integer', default: 0 },
          isAccepted: { type: 'boolean', default: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          user: { $ref: '#/components/schemas/UserSummary' },
        },
      },

      ForumTag: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },

      // Moderation Schemas
      ModerationResult: {
        type: 'object',
        properties: {
          safe: { type: 'boolean', description: 'Whether content is safe' },
          toxicity_score: { type: 'integer', minimum: 0, maximum: 100 },
          spam_score: { type: 'integer', minimum: 0, maximum: 100 },
          categories: {
            type: 'array',
            items: { type: 'string' },
            description: 'Detected categories (harassment, hate_speech, spam, etc.)',
          },
          action: {
            type: 'string',
            enum: ['approve', 'warn', 'block'],
            description: 'Recommended action',
          },
          reason: { type: 'string', description: 'Explanation of the decision' },
        },
      },

      ModerationWarning: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          reason: { type: 'string' },
          categories: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },

      ModerationBlock: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['block'] },
          reason: { type: 'string' },
          categories: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },

      // Study Group Schemas
      StudyGroup: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          ownerId: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          subject: { type: 'string' },
          maxMembers: { type: 'integer', nullable: true },
          isPrivate: { type: 'boolean', default: false },
          inviteCode: { type: 'string', nullable: true },
          memberCount: { type: 'integer', default: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          owner: { $ref: '#/components/schemas/UserSummary' },
          members: {
            type: 'array',
            items: { $ref: '#/components/schemas/StudyGroupMember' },
          },
        },
      },

      StudyGroupMember: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          groupId: { type: 'string' },
          userId: { type: 'string' },
          role: { type: 'string', default: 'member' },
          joinedAt: { type: 'string', format: 'date-time' },
          user: { $ref: '#/components/schemas/UserSummary' },
        },
      },

      GroupMessage: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          groupId: { type: 'string' },
          userId: { type: 'string' },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          user: { $ref: '#/components/schemas/UserSummary' },
        },
      },

      // Chat/Session Schemas
      ChatSession: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          title: { type: 'string', default: 'Chat Session' },
          subject: { type: 'string', default: 'General' },
          description: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      ChatMessage: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          sessionId: { type: 'string' },
          senderId: { type: 'string' },
          content: { type: 'string' },
          role: { type: 'string', enum: ['user', 'assistant'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      // User Schemas
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          displayName: { type: 'string', nullable: true },
          bio: { type: 'string', nullable: true },
          avatarUrl: { type: 'string', nullable: true },
          university: { type: 'string', nullable: true },
          major: { type: 'string', nullable: true },
          reputation: { type: 'integer', default: 0 },
          xp: { type: 'integer', description: 'Total XP from user record' },
          level: { type: 'integer', description: 'Current level' },
          xpProgress: {
            type: 'object',
            properties: {
              current: { type: 'integer' },
              required: { type: 'integer' },
              percentage: { type: 'number' },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      UserSummary: {
        type: 'object',
        description: 'Minimal user info for embedding in other objects',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          profile: {
            type: 'object',
            properties: {
              displayName: { type: 'string', nullable: true },
              major: { type: 'string', nullable: true },
            },
          },
        },
      },

      PointTransaction: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          actionType: {
            type: 'string',
            enum: [
              'FORUM_POST_CREATED',
              'FORUM_REPLY_CREATED',
              'FORUM_UPVOTE_RECEIVED',
              'MATERIAL_UPLOADED',
              'STUDY_GROUP_CREATED',
              'STUDY_GROUP_JOINED',
              'STUDY_GROUP_MESSAGE_SENT',
              'REVIEW_POSTED',
            ],
          },
          points: { type: 'integer' },
          description: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
}
