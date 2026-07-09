import {
  Accessibility,
  BatteryCharging,
  Bike,
  Bus,
  Car,
  Check,
  Coffee,
  Dog,
  Droplets,
  Footprints,
  House,
  MapPin,
  Sandwich,
  Sun,
  Users,
  Utensils,
  Wifi,
  type LucideIcon,
} from "lucide-react-native";
import type {
  FacilityKey,
  WalkerCharacteristicKey,
} from "@waypoint/ui";

/**
 * Mobile-side icon registry for the shared walker-characteristic and
 * facility keys. @waypoint/ui deliberately keeps emoji *strings* --
 * they render fine in the SvelteKit portals' HTML -- but React Native
 * needs real vector icons, so the key→icon mapping lives here, on the
 * only surface that needs it.
 */
export const walkerCharacteristicIcons: Record<
  WalkerCharacteristicKey,
  LucideIcon
> = {
  boots_welcome: Footprints,
  dogs_welcome: Dog,
  water_refill: Droplets,
  outdoor_seating: Sun,
  packed_lunches: Sandwich,
  phone_charging: BatteryCharging,
  family_friendly: Users,
  wheelchair_friendly: Accessibility,
};

export const facilityIcons: Record<FacilityKey, LucideIcon> = {
  toilets: House,
  parking: Car,
  bike_parking: Bike,
  public_transport: Bus,
  wifi: Wifi,
  food: Utensils,
  hot_drinks: Coffee,
  shelter: House,
};

export const fallbackFactIcons = {
  characteristic: Footprints,
  facility: Check,
  waypoint: MapPin,
} as const;
