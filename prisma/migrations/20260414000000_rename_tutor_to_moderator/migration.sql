-- Rename TUTOR enum value to MODERATOR
-- TUTOR had no teaching capabilities in Domain 8 (Student Community Platform).
-- The role's only extra permissions are content moderation. Renaming to MODERATOR
-- eliminates confusion with the AI Tutor chatbot feature and matches the spec
-- requirement: "role-based moderation controls".
ALTER TYPE "UserRole" RENAME VALUE 'TUTOR' TO 'MODERATOR';
