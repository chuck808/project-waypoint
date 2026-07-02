# BP006 – System Architecture

**Project:** Project Waypoint  
**Blueprint:** BP006  
**Version:** 0.1  
**Status:** Draft  
**Author:** Project Waypoint Team  
**Depends On:** BP001, BP002, BP003, BP004, BP005

---

## 1. Purpose

This blueprint defines the high-level system architecture for Project Waypoint.

It describes the major system components, their responsibilities, and how they interact.

---

## 2. Architecture Summary

Project Waypoint is composed of three primary user-facing applications supported by a shared backend platform.

```text
Mobile App
Business Portal
Admin Portal
        │
        ▼
Shared Backend Platform
        │
        ▼
Database / Storage / External Services
```

The system must support walkers, businesses, administrators, shared identity, permissions, trails, businesses, passport data, community data, QR check-ins, analytics, moderation, and future offline capability.

---

## 3. Primary Applications

### Mobile App

Primary interface for walkers.

Supports registration, trail discovery, trail details, active walks, nearby places, QR check-ins, passport stamps, achievements, community reports, profile, and basic offline access.

### Business Portal

Primary interface for participating businesses.

Supports business registration, profile management, offers, QR codes, visitor analytics, redemption history, and settings.

### Admin Portal

Used by platform maintainers.

Supports user management, business approval, business moderation, trail management, report moderation, content review, analytics, and platform health monitoring.

---

## 4. Backend Platform Services

- Authentication
- Authorisation
- Trail Service
- Business Service
- Offer Service
- Check-in Service
- Passport Service
- Achievement Service
- Community Report Service
- Notification Service
- Analytics Service
- Moderation Service

---

## 5. Shared Data Domains

```text
Identity
Users
Trails
Regions
Businesses
Offers
Check-ins
Passport
Achievements
Community Reports
Moderation
Analytics
Notifications
```

---

## 6. External Services

- Maps: Mapbox, MapLibre, Google Maps, or Ordnance Survey data where licensing permits
- Payments: Stripe later
- Email
- Push Notifications
- File Storage

---

## 7. High-Level Interaction Flows

### Walker Trail Flow

```text
Walker opens mobile app
        ↓
Browses trails
        ↓
Views trail detail
        ↓
Starts walk
        ↓
Completes walk
        ↓
Earns trail stamp
        ↓
Views passport update
```

### Business Visit Flow

```text
Walker visits business
        ↓
Scans QR code
        ↓
Backend validates check-in
        ↓
Visit recorded
        ↓
Stamp / offer applied
        ↓
Business analytics updated
```

### Community Report Flow

```text
Walker submits report
        ↓
Report stored
        ↓
Other walkers confirm or dispute
        ↓
Moderator reviews if needed
        ↓
Report expires or is resolved
```

### Business Onboarding Flow

```text
Business registers
        ↓
Creates profile
        ↓
Admin reviews
        ↓
Business approved
        ↓
QR code issued
        ↓
Business becomes visible
```

---

## 8. Suggested MVP Technical Shape

```text
Mobile App: React Native / Expo
Business Portal: SvelteKit
Admin Portal: SvelteKit
Backend: Supabase
Database: Supabase Postgres
Auth: Supabase Auth
Storage: Supabase Storage
Server Logic: Supabase Edge Functions
Hosting: Vercel / Cloudflare / Supabase
Payments: Stripe later
Maps: Mapbox / MapLibre / Google Maps
```

---

## 9. Security Principles

- authentication required for personal data
- role-based permissions
- business users restricted to their own businesses
- admin access tightly controlled
- sensitive operations logged
- QR check-ins validated server-side
- personal data minimised
- analytics aggregated where possible

Security must not rely on client-side checks alone.

---

## 10. Offline Considerations

Future offline needs include saved trail data, saved business data, cached map tiles, active walk progress, pending QR scans, pending community reports, and sync once connection returns.

---

## 11. Data Ownership Principles

| Domain | Owned By |
|---|---|
| User profile | Walker |
| Passport history | System + Walker |
| Business profile | Business + Admin |
| Trail data | Admin |
| Community reports | Contributor + Moderation |
| Check-ins | System |
| Offers | Business |
| Achievements | System |
| Analytics | System |

---

## 12. Architectural Priorities

1. Trust
2. Simplicity
3. Maintainability
4. Data integrity
5. MVP speed
6. Future offline support
7. Scalability

---

## 13. Architectural Non-Goals for MVP

- complex microservices
- custom routing engine
- full offline navigation
- real-time social feeds
- in-app messaging
- advanced recommendation engine
- full payment marketplace
- wearable integrations
- AI-generated route planning

---

## 14. System Boundary

Waypoint is responsible for preserving walking activity, connecting walkers with businesses, managing passport stamps, handling check-ins, surfacing community reports, supporting business participation, and maintaining platform trust.

Waypoint is not responsible for guaranteeing route safety, replacing emergency services, verifying all community information in real time, providing professional navigation guarantees, managing accommodation bookings, or processing business payments in the MVP.

---

**End of BP006**
