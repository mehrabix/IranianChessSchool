import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: integer('email_verified', { mode: 'timestamp' }),
  passwordHash: text('password_hash'),
  image: text('image'),
  role: text('role', { enum: ['STUDENT', 'COACH', 'ADMIN'] }).default('STUDENT'),
  chessComUsername: text('chess_com_username'),
  lichessUsername: text('lichess_username'),
  rating: integer('rating').default(0),
  xp: integer('xp').default(0),
  level: integer('level').default(1),
  streak: integer('streak').default(0),
  lastActive: integer('last_active', { mode: 'timestamp' }),
  stripeCustomerId: text('stripe_customer_id'),
  subscriptionId: text('subscription_id'),
  subscriptionStatus: text('subscription_status'),
  paymentProvider: text('payment_provider'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

export const sessions = sqliteTable('sessions', {
  sessionToken: text('session_token').primaryKey().notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const verificationTokens = sqliteTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  level: text('level', { enum: ['BEGINNER', 'IMPROVER', 'INTERMEDIATE', 'ADVANCED', 'CLUB'] }),
  image: text('image'),
  published: integer('published', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  order: integer('order').notNull(),
  courseId: text('course_id').references(() => courses.id),
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  videoUrl: text('video_url'),
  order: integer('order').notNull(),
  moduleId: text('module_id').references(() => modules.id),
  courseId: text('course_id').references(() => courses.id),
  type: text('type', { enum: ['VIDEO', 'TEXT', 'INTERACTIVE', 'QUIZ'] }),
  duration: integer('duration'),
});

export const puzzles = sqliteTable('puzzles', {
  id: text('id').primaryKey(),
  fen: text('fen').notNull(),
  solution: text('solution').notNull(),
  rating: integer('rating'),
  themes: text('themes'),
  popularity: integer('popularity'),
  playedCount: integer('played_count').default(0),
  successRate: real('success_rate'),
  source: text('source', { enum: ['LICHESS', 'CUSTOM'] }),
});

export const progress = sqliteTable('progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  lessonId: text('lesson_id').references(() => lessons.id),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  score: integer('score'),
  timeSpent: integer('time_spent'),
  attempts: integer('attempts').default(0),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  stripeSubscriptionId: text('stripe_subscription_id'),
  providerSubscriptionId: text('provider_subscription_id'),
  plan: text('plan', { enum: ['STANDARD', 'PREMIUM', 'VIP'] }),
  status: text('status', { enum: ['ACTIVE', 'CANCELED', 'PAST_DUE'] }),
  currentPeriodStart: integer('current_period_start', { mode: 'timestamp' }),
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }),
  cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }).default(false),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  content: text('content'),
  image: text('image'),
  pgn: text('pgn'),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  type: text('type'),
  title: text('title'),
  description: text('description'),
  icon: text('icon'),
  xpReward: integer('xp_reward'),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const quizzes = sqliteTable('quizzes', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  lessonId: text('lesson_id').references(() => lessons.id),
  passingScore: integer('passing_score').default(70),
  maxAttempts: integer('max_attempts').default(3),
  timeLimit: integer('time_limit'), // seconds
  order: integer('order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const quizQuestions = sqliteTable('quiz_questions', {
  id: text('id').primaryKey(),
  quizId: text('quiz_id').references(() => quizzes.id),
  questionText: text('question_text').notNull(),
  options: text('options').notNull(), // JSON array of strings
  correctIndices: text('correct_indices').notNull(), // JSON array of numbers
  type: text('type', { enum: ['SINGLE', 'MULTIPLE', 'TRUE_FALSE', 'TEXT'] }).default('SINGLE'),
  order: integer('order').default(0),
  explanation: text('explanation'),
  points: integer('points').default(10),
});

export const quizAttempts = sqliteTable('quiz_attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  quizId: text('quiz_id').references(() => quizzes.id),
  score: integer('score').default(0),
  totalPoints: integer('total_points').default(0),
  percentage: real('percentage').default(0),
  passed: integer('passed', { mode: 'boolean' }).default(false),
  startedAt: integer('started_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

export const quizAnswers = sqliteTable('quiz_answers', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id').references(() => quizAttempts.id),
  questionId: text('question_id').references(() => quizQuestions.id),
  selectedIndices: text('selected_indices'), // JSON array of selected option indices
  textAnswer: text('text_answer'),
  isCorrect: integer('is_correct', { mode: 'boolean' }).default(false),
  pointsEarned: integer('points_earned').default(0),
});

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  coachId: text('coach_id').references(() => users.id),
  studentId: text('student_id').references(() => users.id),
  startTime: integer('start_time', { mode: 'timestamp' }),
  endTime: integer('end_time', { mode: 'timestamp' }),
  status: text('status', { enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'] }),
  meetingLink: text('meeting_link'),
  notes: text('notes'),
  price: integer('price'),
});

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const likes = sqliteTable('likes', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const follows = sqliteTable('follows', {
  id: text('id').primaryKey(),
  followerId: text('follower_id').references(() => users.id, { onDelete: 'cascade' }),
  followingId: text('following_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category', { enum: ['OPENINGS', 'ENDGAMES', 'TACTICS', 'STRATEGY', 'GENERAL'] }).default('GENERAL'),
  createdBy: text('created_by').references(() => users.id),
  memberCount: integer('member_count').default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const groupMembers = sqliteTable('group_members', {
  id: text('id').primaryKey(),
  groupId: text('group_id').references(() => groups.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['ADMIN', 'MEMBER'] }).default('MEMBER'),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const tournaments = sqliteTable('tournaments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: ['SWISS', 'ROUND_ROBIN', 'KNOCKOUT'] }).default('SWISS'),
  status: text('status', { enum: ['UPCOMING', 'ACTIVE', 'COMPLETED'] }).default('UPCOMING'),
  maxPlayers: integer('max_players').default(16),
  createdBy: text('created_by').references(() => users.id),
  winnerId: text('winner_id').references(() => users.id),
  startDate: integer('start_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const tournamentPlayers = sqliteTable('tournament_players', {
  id: text('id').primaryKey(),
  tournamentId: text('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  score: integer('score').default(0),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['LIKE', 'COMMENT', 'FOLLOW', 'ACHIEVEMENT', 'SYSTEM'] }).notNull(),
  title: text('title').notNull(),
  body: text('body'),
  link: text('link'),
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const pendingPayments = sqliteTable('pending_payments', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  authority: text('authority').unique().notNull(),
  plan: text('plan'),
  amount: integer('amount').notNull(),
  provider: text('provider'),
  status: text('status', { enum: ['PENDING', 'VERIFIED', 'FAILED'] }).default('PENDING'),
  refId: text('ref_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

export const homeworks = sqliteTable('homeworks', {
  id: text('id').primaryKey(),
  coachId: text('coach_id').references(() => users.id).notNull(),
  studentId: text('student_id').references(() => users.id).notNull(),
  lessonId: text('lesson_id').references(() => lessons.id),
  courseId: text('course_id').references(() => courses.id),
  title: text('title').notNull(),
  description: text('description'),
  pgn: text('pgn'),
  status: text('status', { enum: ['PENDING', 'SUBMITTED', 'REVIEWED'] }).default('PENDING'),
  coachNotes: text('coach_notes'),
  studentNotes: text('student_notes'),
  assignedAt: integer('assigned_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  submittedAt: integer('submitted_at', { mode: 'timestamp' }),
  reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
});

export const challenges = sqliteTable('challenges', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type', { enum: ['PUZZLES', 'LESSONS', 'GAMES', 'POSTS'] }).notNull(),
  goal: integer('goal').notNull(),
  xpReward: integer('xp_reward').default(100),
  startsAt: integer('starts_at', { mode: 'timestamp' }).notNull(),
  endsAt: integer('ends_at', { mode: 'timestamp' }).notNull(),
  active: integer('active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const challengeProgress = sqliteTable('challenge_progress', {
  id: text('id').primaryKey(),
  challengeId: text('challenge_id').references(() => challenges.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  progress: integer('progress').default(0),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});