import { DAYS } from "../models/constants";

export const defaultScheduleEntries = [
  { day: DAYS[0], time: "06:00 AM - 07:15 AM", className: "Sunrise Vinyasa", instructor: "Aria Sharma", room: "Studio A", level: "Intermediate", color: "border-l-teal" },
  { day: DAYS[0], time: "09:00 AM - 10:15 AM", className: "Hatha Basics", instructor: "Kaelen Voss", room: "Studio B", level: "Beginner", color: "border-l-saffron" },
  { day: DAYS[0], time: "05:30 PM - 06:45 PM", className: "Power Flow", instructor: "Maya Chen", room: "Studio A", level: "Advanced", color: "border-l-lavender" },
  { day: DAYS[1], time: "07:00 AM - 08:15 AM", className: "Ashtanga Primary", instructor: "Maya Chen", room: "Studio A", level: "Advanced", color: "border-l-lavender" },
  { day: DAYS[1], time: "10:30 AM - 11:45 AM", className: "Gentle Flow", instructor: "Aria Sharma", room: "Studio B", level: "Beginner", color: "border-l-teal" },
  { day: DAYS[2], time: "12:00 PM - 01:00 PM", className: "Lunch Hour Flow", instructor: "Kaelen Voss", room: "Studio A", level: "All Levels", color: "border-l-saffron" },
  { day: DAYS[3], time: "07:00 AM - 08:15 AM", className: "Morning Meditation", instructor: "Kaelen Voss", room: "Studio B", level: "All Levels", color: "border-l-earth" },
  { day: DAYS[4], time: "05:00 PM - 06:15 PM", className: "Weekend Warmup", instructor: "Maya Chen", room: "Studio A", level: "Intermediate", color: "border-l-saffron" },
  { day: DAYS[5], time: "08:30 AM - 10:00 AM", className: "Community Flow", instructor: "Rotating Teachers", room: "Studio A", level: "All Levels", color: "border-l-earth" },
  { day: DAYS[6], time: "09:00 AM - 10:30 AM", className: "Soulful Sunday", instructor: "Aria Sharma", room: "Studio A", level: "All Levels", color: "border-l-lavender" }
];
