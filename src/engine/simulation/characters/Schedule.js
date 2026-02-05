/**
 * SCHEDULE SYSTEM
 * 
 * Defines character schedules for different roles/departments.
 * Schedules dictate what state a character should be in at any given time.
 */

// ============================================
// SCHEDULE TYPES
// ============================================

/**
 * Standard 9-5 schedule (most workers)
 * Times are in 24-hour format as [hour, minute]
 */
export const SCHEDULE_STANDARD = {
  id: 'standard',
  name: 'Standard (9-5)',
  entries: [
    { start: [7, 0],  end: [7, 30],  state: 'waking_up', action: 'Waking up' },
    { start: [7, 30], end: [8, 0],   state: 'morning_routine', action: 'Morning routine' },
    { start: [8, 0],  end: [8, 30],  state: 'commuting', action: 'Walking to work' },
    { start: [8, 30], end: [12, 0],  state: 'working', action: 'Working' },
    { start: [12, 0], end: [13, 0],  state: 'break', action: 'Lunch break' },
    { start: [13, 0], end: [17, 0],  state: 'working', action: 'Working' },
    { start: [17, 0], end: [17, 30], state: 'commuting', action: 'Walking home' },
    { start: [17, 30], end: [19, 0], state: 'leisure', action: 'Relaxing' },
    { start: [19, 0], end: [20, 0],  state: 'eating', action: 'Having dinner' },
    { start: [20, 0], end: [22, 0],  state: 'leisure', action: 'Evening leisure' },
    { start: [22, 0], end: [7, 0],   state: 'sleeping', action: 'Sleeping' }
  ]
};

/**
 * Security morning shift (6 AM - 2 PM)
 */
export const SCHEDULE_SECURITY_MORNING = {
  id: 'security_morning',
  name: 'Security Morning Shift',
  entries: [
    { start: [5, 0],  end: [5, 30],  state: 'waking_up', action: 'Waking up' },
    { start: [5, 30], end: [6, 0],   state: 'commuting', action: 'Walking to work' },
    { start: [6, 0],  end: [10, 0],  state: 'working', action: 'On duty' },
    { start: [10, 0], end: [10, 30], state: 'break', action: 'Break' },
    { start: [10, 30], end: [14, 0], state: 'working', action: 'On duty' },
    { start: [14, 0], end: [14, 30], state: 'commuting', action: 'Walking home' },
    { start: [14, 30], end: [18, 0], state: 'leisure', action: 'Relaxing' },
    { start: [18, 0], end: [19, 0],  state: 'eating', action: 'Having dinner' },
    { start: [19, 0], end: [21, 0],  state: 'leisure', action: 'Evening leisure' },
    { start: [21, 0], end: [5, 0],   state: 'sleeping', action: 'Sleeping' }
  ]
};

/**
 * Security evening shift (2 PM - 10 PM)
 */
export const SCHEDULE_SECURITY_EVENING = {
  id: 'security_evening',
  name: 'Security Evening Shift',
  entries: [
    { start: [10, 0], end: [11, 0],  state: 'waking_up', action: 'Waking up' },
    { start: [11, 0], end: [12, 0],  state: 'leisure', action: 'Morning leisure' },
    { start: [12, 0], end: [13, 0],  state: 'eating', action: 'Having lunch' },
    { start: [13, 0], end: [13, 30], state: 'commuting', action: 'Walking to work' },
    { start: [13, 30], end: [18, 0], state: 'working', action: 'On duty' },
    { start: [18, 0], end: [18, 30], state: 'break', action: 'Break' },
    { start: [18, 30], end: [22, 0], state: 'working', action: 'On duty' },
    { start: [22, 0], end: [22, 30], state: 'commuting', action: 'Walking home' },
    { start: [22, 30], end: [23, 30], state: 'leisure', action: 'Late night leisure' },
    { start: [23, 30], end: [10, 0], state: 'sleeping', action: 'Sleeping' }
  ]
};

/**
 * Security night shift (10 PM - 6 AM)
 */
export const SCHEDULE_SECURITY_NIGHT = {
  id: 'security_night',
  name: 'Security Night Shift',
  entries: [
    { start: [18, 0], end: [19, 0],  state: 'waking_up', action: 'Waking up' },
    { start: [19, 0], end: [20, 0],  state: 'eating', action: 'Having dinner' },
    { start: [20, 0], end: [21, 0],  state: 'leisure', action: 'Pre-work leisure' },
    { start: [21, 0], end: [21, 30], state: 'commuting', action: 'Walking to work' },
    { start: [21, 30], end: [2, 0],  state: 'working', action: 'On duty' },
    { start: [2, 0],  end: [2, 30],  state: 'break', action: 'Break' },
    { start: [2, 30], end: [6, 0],   state: 'working', action: 'On duty' },
    { start: [6, 0],  end: [6, 30],  state: 'commuting', action: 'Walking home' },
    { start: [6, 30], end: [7, 30],  state: 'leisure', action: 'Winding down' },
    { start: [7, 30], end: [18, 0],  state: 'sleeping', action: 'Sleeping' }
  ]
};

/**
 * Management schedule (later start, longer hours)
 */
export const SCHEDULE_MANAGEMENT = {
  id: 'management',
  name: 'Management',
  entries: [
    { start: [7, 30], end: [8, 0],   state: 'waking_up', action: 'Waking up' },
    { start: [8, 0],  end: [8, 30],  state: 'morning_routine', action: 'Morning routine' },
    { start: [8, 30], end: [9, 0],   state: 'commuting', action: 'Walking to work' },
    { start: [9, 0],  end: [12, 30], state: 'working', action: 'Working' },
    { start: [12, 30], end: [13, 30], state: 'break', action: 'Lunch meeting' },
    { start: [13, 30], end: [18, 0], state: 'working', action: 'Working' },
    { start: [18, 0], end: [18, 30], state: 'commuting', action: 'Walking home' },
    { start: [18, 30], end: [20, 0], state: 'leisure', action: 'Relaxing' },
    { start: [20, 0], end: [21, 0],  state: 'eating', action: 'Having dinner' },
    { start: [21, 0], end: [23, 0],  state: 'leisure', action: 'Evening leisure' },
    { start: [23, 0], end: [7, 30],  state: 'sleeping', action: 'Sleeping' }
  ]
};

// ============================================
// SCHEDULE ASSIGNMENT
// ============================================

const SCHEDULES = {
  standard: SCHEDULE_STANDARD,
  security_morning: SCHEDULE_SECURITY_MORNING,
  security_evening: SCHEDULE_SECURITY_EVENING,
  security_night: SCHEDULE_SECURITY_NIGHT,
  management: SCHEDULE_MANAGEMENT
};

// Store for security shift assignments (ensures consistent assignment)
const securityShiftAssignments = new Map();

/**
 * Assign schedules to all characters, ensuring proper distribution
 * This should be called once with all characters to ensure security shifts are covered
 */
export function assignSchedulesToAll(characters) {
  // Clear previous assignments
  securityShiftAssignments.clear();
  
  // Find all security workers
  const securityWorkers = characters.filter(c => c.department?.id === 'security');
  
  // Sort by ID for consistent ordering
  securityWorkers.sort((a, b) => a.id.localeCompare(b.id));
  
  // Separate chief from officers
  const chief = securityWorkers.find(c => c.role.title.toLowerCase().includes('chief'));
  const officers = securityWorkers.filter(c => !c.role.title.toLowerCase().includes('chief'));
  
  // Assign chief to morning shift
  if (chief) {
    securityShiftAssignments.set(chief.id, SCHEDULE_SECURITY_MORNING);
  }
  
  // Distribute officers across shifts, prioritizing evening and night first
  // (since chief covers morning)
  const shiftPriority = [
    SCHEDULE_SECURITY_EVENING,
    SCHEDULE_SECURITY_NIGHT,
    SCHEDULE_SECURITY_MORNING  // Extra officers go to morning last
  ];
  
  officers.forEach((officer, index) => {
    const shift = shiftPriority[index % shiftPriority.length];
    securityShiftAssignments.set(officer.id, shift);
  });
  
  // Log the distribution
  console.log('[Schedule] Security shift assignments:');
  for (const [id, schedule] of securityShiftAssignments) {
    const char = characters.find(c => c.id === id);
    console.log(`  ${char?.fullName || id}: ${schedule.name}`);
  }
  
  // Assign schedules to all characters
  for (const character of characters) {
    character.sim.schedule = getScheduleForCharacter(character);
  }
}

/**
 * Get appropriate schedule for a character based on their role
 */
export function getScheduleForCharacter(character) {
  const deptId = character.department?.id;
  const roleTitle = character.role?.title?.toLowerCase() || '';
  
  // Security uses pre-assigned shifts if available
  if (deptId === 'security') {
    const preAssigned = securityShiftAssignments.get(character.id);
    if (preAssigned) {
      return preAssigned;
    }
    
    // Fallback: Chief gets morning, others get distributed
    if (roleTitle.includes('chief')) {
      return SCHEDULE_SECURITY_MORNING;
    }
    // Without batch assignment, fall back to evening (most likely needed)
    return SCHEDULE_SECURITY_EVENING;
  }
  
  // Management gets management schedule
  if (deptId === 'management' || roleTitle.includes('director') || roleTitle.includes('manager')) {
    return SCHEDULE_MANAGEMENT;
  }
  
  // Everyone else gets standard
  return SCHEDULE_STANDARD;
}

/**
 * Get schedule by ID
 */
export function getSchedule(scheduleId) {
  return SCHEDULES[scheduleId] || SCHEDULE_STANDARD;
}

/**
 * Convert time to minutes for comparison
 */
function timeToMinutes(hour, minute) {
  return hour * 60 + minute;
}

/**
 * Check if current time falls within a schedule entry
 * Handles overnight entries (e.g., 22:00 to 7:00)
 */
function isWithinEntry(currentMinutes, entry) {
  const startMinutes = timeToMinutes(entry.start[0], entry.start[1]);
  const endMinutes = timeToMinutes(entry.end[0], entry.end[1]);
  
  if (endMinutes < startMinutes) {
    // Overnight entry
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

/**
 * Get what a character should be doing at a given time
 */
export function getScheduledActivity(schedule, hour, minute) {
  const currentMinutes = timeToMinutes(hour, minute);
  
  for (const entry of schedule.entries) {
    if (isWithinEntry(currentMinutes, entry)) {
      return {
        state: entry.state,
        action: entry.action
      };
    }
  }
  
  // Fallback (should never happen with complete schedules)
  return { state: 'idle', action: 'Idle' };
}

/**
 * Get next schedule transition time
 */
export function getNextTransition(schedule, hour, minute) {
  const currentMinutes = timeToMinutes(hour, minute);
  
  for (const entry of schedule.entries) {
    if (isWithinEntry(currentMinutes, entry)) {
      const endMinutes = timeToMinutes(entry.end[0], entry.end[1]);
      
      // Handle overnight
      if (endMinutes < currentMinutes) {
        return { minutesUntil: (1440 - currentMinutes) + endMinutes };
      }
      
      return { minutesUntil: endMinutes - currentMinutes };
    }
  }
  
  return { minutesUntil: 60 }; // Fallback
}

export default {
  SCHEDULE_STANDARD,
  SCHEDULE_SECURITY_MORNING,
  SCHEDULE_SECURITY_EVENING,
  SCHEDULE_SECURITY_NIGHT,
  SCHEDULE_MANAGEMENT,
  getScheduleForCharacter,
  getSchedule,
  getScheduledActivity,
  getNextTransition
};
