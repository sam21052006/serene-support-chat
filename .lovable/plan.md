

# Fix Login Page Errors and Security Improvements

## Issues Identified

1. **Auth state race condition**: The `useAuth` hook sets up `onAuthStateChange` and `getSession` in parallel, which can cause the auth state to flip-flop and trigger premature redirects or failed queries.

2. **No password reset flow**: Users have no way to reset forgotten passwords -- there's no "Forgot password?" link, no reset email flow, and no `/reset-password` page.

3. **Missing input sanitization on signup**: The display name field has no length limit, max-length, or trim. Malicious or very long display names can be submitted.

4. **No loading state on initial auth check**: The Auth page doesn't show a loading state while `useAuth` is resolving -- if auth is loading, the form briefly flashes before redirecting logged-in users.

5. **Chat input has no length validation**: The chat message textarea accepts unlimited input with no `maxLength` constraint, which could send oversized payloads to the backend function.

6. **Display name not validated in the database trigger**: The `handle_new_user()` trigger inserts `display_name` from `raw_user_meta_data` without trimming or length limits.

---

## Plan

### 1. Fix auth state initialization in `useAuth`
- Reorder so `onAuthStateChange` is set up BEFORE `getSession` (already done, but add a guard so `getSession` doesn't overwrite a later auth event)
- Add a `ready` flag to prevent premature redirects

### 2. Add loading guard to Auth page
- Show a spinner while `loading` is true from `useAuth` instead of flashing the form

### 3. Add display name validation
- Trim and limit display name to 100 characters on the client (Auth.tsx)
- Add `maxLength={100}` to the display name input
- Add Zod validation for display name when signing up

### 4. Add "Forgot Password?" flow
- Add a "Forgot password?" link on the Auth page login form
- Create a forgot password state that shows an email-only form calling `supabase.auth.resetPasswordForEmail()`
- Create a new `/reset-password` page that reads the recovery token from the URL hash and lets users set a new password
- Add the route in `App.tsx`

### 5. Add chat input length limit
- Add `maxLength={5000}` to the ChatInput textarea (matches the edge function's 5000-char limit)

### 6. Update `handle_new_user()` database function
- Run a migration to update the trigger function to trim and truncate display_name to 100 characters

---

## Technical Details

### Files to modify:
- `src/hooks/useAuth.tsx` -- improve auth state handling
- `src/pages/Auth.tsx` -- add loading guard, display name validation, forgot password link/form
- `src/pages/ResetPassword.tsx` -- new file for password reset page
- `src/App.tsx` -- add `/reset-password` route
- `src/components/chat/ChatInput.tsx` -- add maxLength to textarea
- Database migration -- update `handle_new_user()` function with input sanitization

### Files NOT modified:
- `src/integrations/supabase/client.ts` (auto-generated)
- `src/integrations/supabase/types.ts` (auto-generated)
- `.env` (auto-generated)
- `supabase/config.toml` (auto-generated)

