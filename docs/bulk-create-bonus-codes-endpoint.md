# Bulk Create & Send Bonus Codes – API Spec

Backend endpoint used by the Bonus Codes “Bulk Create for Club” flow. Creates one unique bonus code per onboarded player in a club and optionally sends each code via email and/or Telegram.

---

## Endpoint

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/bonus-codes/bulk-create-send` |
| **Auth** | Required (same as other bonus-code endpoints; frontend sends bearer token via API client). |

---

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `club` | string | Yes | Club code (e.g. `"RT"`, `"CC"`, `"AT"`). |
| `bonus_type` | string | Yes | Bonus type for all created codes. Can be a known value (`onboarding`, `referral`, `special`, `promotion`) or **any custom string** (e.g. `"holiday_2025"`, `"vip_reward"`). Backend should store exactly as sent. |
| `code_prefix` | string | No | Prefix for generated codes (e.g. `"BULK"`, `"CLUB"`). Default if omitted is implementation-defined (e.g. `"BULK"`). |
| `code_length` | number | No | Length of the random part of the code (e.g. `8`). Default if omitted is implementation-defined (e.g. `8`). |
| `send_email` | boolean | Yes | Whether to send each code by email. |
| `send_telegram` | boolean | Yes | Whether to send each code by Telegram. |
| `email_subject` | string | No | Subject for email. Required when `send_email` is true. |
| `email_body` | string | No | Body for email. Supports placeholder `{{code}}` (and optionally `{{username}}`). Required when `send_email` is true. |
| `telegram_text` | string | No | Message for Telegram. Supports placeholder `{{code}}` (and optionally `{{username}}`). Required when `send_telegram` is true. |

**Example (preset bonus type):**

```json
{
  "club": "RT",
  "bonus_type": "promotion",
  "code_prefix": "PROMO",
  "code_length": 8,
  "send_email": true,
  "send_telegram": true,
  "email_subject": "Your bonus code",
  "email_body": "Hi, your code is: {{code}}",
  "telegram_text": "Your code: {{code}}"
}
```

**Example (custom bonus type):**

```json
{
  "club": "CC",
  "bonus_type": "custom_holiday_2025",
  "code_prefix": "HOL",
  "code_length": 6,
  "send_email": true,
  "send_telegram": false,
  "email_subject": "Holiday bonus",
  "email_body": "Your code: {{code}}"
}
```

---

## Response Body (Success)

Use the same envelope as other endpoints (e.g. `{ ok: true, data: { ... } }`). The `data` object:

| Field | Type | Description |
|-------|------|-------------|
| `created` | number | Number of bonus codes successfully created. |
| `email_sent` | number | Number of emails successfully sent. |
| `telegram_sent` | number | Number of Telegram messages successfully sent. |
| `failures` | array | Optional. Per-recipient failures. |
| `failures[].club_gg_id` | string | ClubGG ID of the user that failed. |
| `failures[].reason` | string | Error message (e.g. "user not found", "email send failed"). |
| `failures[].channel` | string | Optional. `"email"` \| `"telegram"` \| `"both"`. |
| `codes` | array | Optional. List of created codes for auditing. |
| `codes[].code` | string | The bonus code. |
| `codes[].club_gg_id` | string | ClubGG ID it was created for. |
| `codes[].player_email` | string | Optional. Player email. |

**Example:**

```json
{
  "ok": true,
  "data": {
    "created": 10,
    "email_sent": 10,
    "telegram_sent": 8,
    "failures": [
      { "club_gg_id": "1234-5678", "reason": "No Telegram chat_id", "channel": "telegram" }
    ],
    "codes": [
      { "code": "PROMOa1b2c3d4", "club_gg_id": "1111-2222", "player_email": "u@example.com" }
    ]
  }
}
```

---

## Backend Behavior (Recommended)

1. **Resolve recipients**  
   Fetch all onboarded users for the given `club` (e.g. from users table filtered by club). Only include users with a valid `club_gg_id` (and email if `send_email` is true, Telegram id if `send_telegram` is true).

2. **Generate codes**  
   For each recipient, generate a unique code (e.g. `{code_prefix}{random_string}` with length `code_prefix.length + code_length`) and ensure uniqueness (e.g. check existing bonus codes).

3. **Bonus type**  
   Store `bonus_type` exactly as received. Do **not** restrict to a fixed enum; allow any string so the UI can support both preset options and a custom bonus type.

4. **Create records**  
   For each recipient, create a bonus code row with: `code`, `club_gg_id`, `bonus_type` (from request), `player_email` (from user), `is_redeemed: false`, etc.

5. **Send**  
   If `send_email`, send one email per user, replacing `{{code}}` (and optionally `{{username}}`) in `email_body`. If `send_telegram`, send one message per user with the same substitution. Track success/failure per user and per channel.

6. **Failures**  
   Populate `failures` for users where create or send failed (e.g. duplicate code, missing email/Telegram, send error). Return partial success (e.g. `created: 9`, `email_sent: 8`, plus 1–2 entries in `failures`).

7. **Validation**  
   - Require at least one of `send_email` or `send_telegram`.  
   - If `send_email` is true, require `email_subject` and `email_body`.  
   - If `send_telegram` is true, require `telegram_text`.  
   - Return 400 with a clear message if validation fails.

---

## Frontend Types (Reference)

Request/response types used by the dashboard live in `src/types/index.ts`:

- **Request:** `BulkCreateSendBonusCodesRequest`  
- **Response:** `BulkCreateSendBonusCodesResponse`  
- **Failure item:** `BulkCreateSendFailure`

The dashboard calls this via `bulkCreateAndSendBonusCodes()` in `src/api/bonusCodes.ts` (POST to `/bonus-codes/bulk-create-send`).
