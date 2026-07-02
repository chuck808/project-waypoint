# ADR-003 – Choose Expo over Bare React Native

**Project:** Project Waypoint  
**Status:** Accepted  
**Date:** 2026-07-02  
**Related:** BP016, BP017

---

## Context

The Waypoint mobile application needs to support:

- iOS and Android
- QR scanning
- camera access
- location access
- offline-friendly behaviour
- push notifications later
- rapid iteration
- testing on real devices

The project should minimise native build complexity during early development.

---

## Decision

Project Waypoint will use **Expo** for the mobile application.

---

## Reasons

Expo provides:

- fast project setup
- excellent developer experience
- real-device testing through Expo Go
- managed access to camera, location and notifications
- simpler builds with EAS when needed
- strong React Native ecosystem support
- good TypeScript support

This is ideal for validating the first Waypoint journey:

```text
Register
    ↓
Browse Trail
    ↓
Scan QR
    ↓
Earn Passport Stamp
```

---

## Alternatives Considered

### Bare React Native

Rejected for Sprint 1 because native configuration would slow early progress.

### Flutter

Rejected because the chosen stack already standardises on TypeScript.

### Native iOS / Android

Rejected because maintaining separate native apps is unnecessary for the MVP.

---

## Consequences

Positive:

- faster mobile development
- easier onboarding
- real-device testing early
- reduced native setup complexity
- good fit for QR/location features

Trade-offs:

- some native customisation may require development builds
- some advanced native modules may require additional setup
- Expo constraints must be monitored as the app grows

---

## Review Trigger

Revisit this decision if Expo limitations block core Waypoint functionality, offline mapping requires unsupported native behaviour, or performance requirements exceed Expo's practical limits.

---

**End of ADR-003**
