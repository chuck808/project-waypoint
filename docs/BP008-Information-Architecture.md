# BP008 – Information Architecture

**Project:** Project Waypoint  
**Blueprint:** BP008  
**Version:** 0.1  
**Status:** Draft  
**Author:** Project Waypoint Team  
**Depends On:** BP001, BP002, BP003, BP004, BP005, BP006, BP007

---

## 1. Purpose

This blueprint defines how Project Waypoint is organised from a user-facing perspective.

It describes the primary navigation structure, major screens, content groupings and information hierarchy across the mobile app, business portal and admin portal.

---

## 2. Product Surfaces

Waypoint has three primary product surfaces.

| Surface | Primary User |
|---|---|
| Mobile App | Walkers |
| Business Portal | Business users |
| Admin Portal | Platform administrators |

---

## 3. Mobile App Information Architecture

The mobile app is the primary Waypoint experience.

Primary mobile navigation:

```text
Home
Discover
Nearby
Passport
Profile
```

### Home

Provides suggested trails, continue active walk, recent passport stamps, nearby businesses, recent community updates, and quick QR scan action.

### Discover

```text
Discover
├── Trails
├── Regions
├── Collections
├── Businesses
└── Points of Interest
```

MVP includes trails, regions, and businesses.

### Trail List

Displays trails with search, filters, region, distance, difficulty, estimated duration, and facilities indicators.

### Trail Detail

```text
Trail Detail
├── Overview
├── Route
├── Facilities
├── Nearby Businesses
├── Community Reports
├── Passport Stamps
└── Practical Information
```

### Active Walk

Supports current location, route progress, distance remaining, nearby facilities, nearby reports, quick report, pause, and finish.

### Nearby

```text
Nearby
├── Businesses
├── Facilities
├── Points of Interest
└── Community Reports
```

### Business Profile

Shows name, category, description, location, opening hours, facilities, offers, QR check-in information, photos, and walking-friendly notes.

### QR Scanner

Supports camera scan, manual fallback code, validation result, stamp result, offer redemption result, invalid code, already redeemed, and offline pending sync.

### Passport

```text
Passport
├── Overview
├── Stamps
├── Trails Completed
├── Businesses Visited
├── Achievements
└── Collections
```

### Community Reports

```text
Reports
├── Nearby Reports
├── Trail Reports
├── Submit Report
└── My Reports
```

### Profile

Includes profile details, walking preferences, saved trails, saved businesses, privacy settings, notification settings, account settings, help and support.

---

## 4. Business Portal Information Architecture

Business portal navigation:

```text
Dashboard
Profile
Offers
QR Codes
Analytics
Settings
```

### Business Dashboard

Shows total visits, recent check-ins, active offers, redemptions, repeat visitors, profile status, and notices.

### Business Profile Management

Manages business name, category, description, location, photos, hours, facilities, walker-friendly notes, and visibility status.

### Offer Management

Manages active, draft, expired offers, redemption rules, dates, and pause/resume.

### QR Code Management

Provides printable QR code, QR status, linked location, linked offer, manual fallback, and future rotating QR controls.

### Business Analytics

Shows check-ins, redemptions, unique visitors, repeat visitors, active days, nearby trail sources, and trends.

### Business Settings

Manages business users, permissions, contact details, notifications, billing future, and pause participation.

---

## 5. Admin Portal Information Architecture

Admin navigation:

```text
Dashboard
Users
Businesses
Trails
Reports
Offers
Moderation
Analytics
Settings
```

Includes user management, business management, trail management, report moderation, offer oversight, and platform analytics.

---

## 6. Cross-Surface Information Rules

| Entity | Mobile App | Business Portal | Admin Portal |
|---|---|---|---|
| User | Own profile | Business user only | Full management |
| Business | Public profile | Own business | All businesses |
| Trail | Browse/use | Nearby source only | Full management |
| Offer | View/redeem | Create/manage own | Review/manage all |
| Report | View/submit | Business-related only | Moderate all |
| Stamp | Earn/view own | Award source only | Manage definitions |
| Analytics | Personal summary | Own business | Platform-wide |

---

## 7. MVP Navigation Scope

Mobile MVP:

- Home
- Discover
- Trail List
- Trail Detail
- Active Walk, basic
- Nearby
- Business Profile
- QR Scanner
- Passport
- Profile
- Community Reports

Business MVP:

- Dashboard
- Profile
- Offers
- QR Codes
- Analytics
- Settings

Admin MVP:

- Dashboard
- Users
- Businesses
- Trails
- Reports
- Offers
- Moderation
- Analytics

---

## 8. Information Architecture Principles

- Walking actions must be quick to access.
- Discovery should feel inviting rather than overwhelming.
- Passport history should feel personal and permanent.
- Community reports should be practical and time-sensitive.
- Business tools should be simple and focused.
- Admin tools should prioritise trust and data quality.
- The same entity should not be duplicated unnecessarily.
- Navigation should reflect user intent rather than internal system structure.

---

**End of BP008**
