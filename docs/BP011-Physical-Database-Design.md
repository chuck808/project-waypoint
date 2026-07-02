# BP011 – Physical Database Design

**Project:** Project Waypoint  
**Blueprint:** BP011  
**Version:** 0.1  
**Status:** Draft  
**Author:** Project Waypoint Team  
**Depends On:** BP001–BP010

---

## 1. Purpose

This blueprint defines the initial physical database design for Project Waypoint using PostgreSQL/Supabase.

It translates the logical data model from BP010 into database tables, relationships, constraints, suggested indexes and security considerations.

This document does not contain final production SQL migrations.

---

## 2. Database Platform

The intended MVP database platform is Supabase PostgreSQL.

Supporting Supabase services:

- Supabase Auth
- Supabase Storage
- Supabase Edge Functions
- Supabase Row Level Security

---

## 3. Core Design Principles

The physical database should:

- use UUID primary keys
- separate auth identity from product profile data
- use explicit foreign keys
- preserve auditability
- support Row Level Security
- avoid premature optimisation
- support geospatial queries
- allow future offline sync
- keep MVP tables understandable

---

## 4. PostgreSQL Extensions

Recommended extensions:

```sql
uuid-ossp
postgis
pgcrypto
```

---

## 5. Table Summary

### Identity

- profiles
- user_roles

### Region and Trail

- regions
- trails
- trail_regions
- trail_routes
- active_walks
- trail_completions

### Business

- businesses
- business_locations
- business_memberships
- business_facilities
- offers
- offer_locations
- qr_codes
- check_ins
- offer_redemptions

### Passport

- passports
- stamp_definitions
- earned_stamps
- achievement_definitions
- earned_achievements

### Community

- community_reports
- report_confirmations

### Moderation and Audit

- moderation_actions
- audit_events

### Notifications

- notifications

### Analytics

- aggregated_summaries

---

## 6. Key Physical Table Notes

### profiles

Stores Waypoint-specific user profile data and references `auth.users(id)`.

### user_roles

Stores application roles: walker, business_user, moderator, admin.

### trail_routes

Should use PostGIS geometry for route lines and geography points for start/end locations.

### business_locations

Should use PostGIS geography point for nearby search.

### qr_codes

Should store unpredictable code values rather than exposing business IDs.

### earned_stamps

Should separate reusable stamp definitions from historical earned records.

### community_reports

Should store report location as geography point and support status/expiry.

### audit_events

Should be append-only where possible.

---

## 7. Suggested Index Categories

### Geospatial

- business_locations.location
- community_reports.location
- trail_routes.start_location
- trail_routes.end_location
- trail_routes.route_geometry

### Lookup

- trails.slug
- regions.slug
- businesses.slug
- qr_codes.code_value

### User Activity

- trail_completions.user_id
- check_ins.user_id
- passports.user_id
- earned_stamps.passport_id
- community_reports.user_id
- notifications.user_id

### Business Activity

- business_locations.business_id
- business_memberships.business_id
- business_memberships.user_id
- offers.business_id
- check_ins.business_location_id
- offer_redemptions.business_location_id

### Moderation

- community_reports.status
- businesses.status
- offers.status
- moderation_actions.target_type, target_id
- audit_events.target_type, target_id

---

## 8. Row Level Security Strategy

RLS should be enabled for all application tables.

### Public readable data

Authenticated users may read:

- published trails
- published regions
- approved active business locations
- active offers
- visible community reports
- active stamp definitions
- active achievement definitions

### User-owned data

Users may read and manage their own:

- profile
- passport
- earned stamps
- earned achievements
- trail completions
- active walks
- check-ins
- notifications
- community reports, subject to moderation rules

### Business-owned data

Business users may manage their own business profile, locations, offers, QR codes, and analytics through `business_memberships`.

### Admin data

Admins and moderators may access moderation queues, reports, business approvals, audit events, and platform analytics.

---

## 9. Supabase Auth Integration

Supabase Auth provides `auth.users`.

Waypoint should not duplicate password hashes, auth provider data, or email verification state.

Recommended trigger:

```text
on auth.users insert
→ create profile
→ create passport
→ assign walker role
```

---

## 10. Storage Buckets

Suggested Supabase Storage buckets:

- avatars
- business-photos
- trail-photos
- report-photos
- stamp-artwork

---

## 11. Soft Delete Strategy

Use status fields rather than hard deletes for trust-sensitive entities:

- users
- businesses
- trails
- offers
- community reports

Audit-sensitive records should not be deleted casually.

---

## 12. Offline Sync Preparation

MVP does not require full offline sync, but tables should support pending status for:

- check_ins
- trail_completions
- community_reports

Future sync fields may include client_id, device_id, sync_status, synced_at, and conflict_status.

---

## 13. Deferred Physical Tables

- collections
- collection_items
- collection_progress
- events
- event_registrations
- clubs
- club_memberships
- subscriptions
- billing_accounts
- campaigns
- tourism_partners
- reputation_scores
- device_sync_state

---

**End of BP011**
