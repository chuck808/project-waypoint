import type { Trail } from "@waypoint/types";

type TrailFact = { label: string; value: string };

export function getTrailFacts(trail: Trail): TrailFact[] {
  return [
    { label: "Distance", value: trail.distance },
    { label: "Difficulty", value: titleCase(trail.difficulty) },
    { label: "Estimated time", value: trail.duration },
    { label: "Route type", value: trail.type.replace("_", " ") },
  ];
}

export function getTrailAdvice(trail: Trail): string {
  if (trail.difficulty === "hard" || trail.difficulty === "expert") {
    return "Take weather, daylight and escape routes seriously. Recent Field Notes are especially useful before setting off.";
  }

  if (trail.difficulty === "easy") {
    return "A gentler walk, but conditions can still change quickly. Check recent observations before you go.";
  }

  return "A proper day out. Check recent conditions and useful places before you start.";
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
