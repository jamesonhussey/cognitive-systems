/**
 * TIME MANAGER
 * 
 * Manages game time for the simulation.
 * 1 real second = 1 game minute (at 1x speed)
 * 
 * Game time is measured in "ticks" where each tick = 1 game minute.
 */

export class TimeManager {
  constructor() {
    // Start at 7:00 AM on day 1
    this.totalMinutes = 7 * 60; // 7:00 AM = 420 minutes into the day
    this.day = 1;
    
    // Time constants
    this.MINUTES_PER_HOUR = 60;
    this.HOURS_PER_DAY = 24;
    this.MINUTES_PER_DAY = this.MINUTES_PER_HOUR * this.HOURS_PER_DAY; // 1440
  }
  
  /**
   * Advance time by one tick (one game minute)
   */
  tick() {
    this.totalMinutes++;
    
    // Check for day rollover
    if (this.totalMinutes >= this.MINUTES_PER_DAY) {
      this.totalMinutes = 0;
      this.day++;
    }
  }
  
  /**
   * Get current hour (0-23)
   */
  getHour() {
    return Math.floor(this.totalMinutes / this.MINUTES_PER_HOUR);
  }
  
  /**
   * Get current minute (0-59)
   */
  getMinute() {
    return this.totalMinutes % this.MINUTES_PER_HOUR;
  }
  
  /**
   * Get formatted time string (HH:MM)
   */
  getTimeString() {
    const hour = this.getHour().toString().padStart(2, '0');
    const minute = this.getMinute().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }
  
  /**
   * Get formatted time with AM/PM
   */
  getTime12Hour() {
    let hour = this.getHour();
    const minute = this.getMinute().toString().padStart(2, '0');
    const period = hour >= 12 ? 'PM' : 'AM';
    
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    
    return `${hour}:${minute} ${period}`;
  }
  
  /**
   * Get current day number
   */
  getDay() {
    return this.day;
  }
  
  /**
   * Get day of week (0 = Monday, 6 = Sunday)
   * Starts on Monday
   */
  getDayOfWeek() {
    return (this.day - 1) % 7;
  }
  
  /**
   * Get day of week name
   */
  getDayName() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[this.getDayOfWeek()];
  }
  
  /**
   * Check if it's a weekend
   */
  isWeekend() {
    const dow = this.getDayOfWeek();
    return dow === 5 || dow === 6; // Saturday or Sunday
  }
  
  /**
   * Check if current time is within a range
   * @param {number} startHour - Start hour (0-23)
   * @param {number} startMinute - Start minute (0-59)
   * @param {number} endHour - End hour (0-23)
   * @param {number} endMinute - End minute (0-59)
   */
  isWithinTimeRange(startHour, startMinute, endHour, endMinute) {
    const currentMinutes = this.totalMinutes;
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Handle overnight ranges (e.g., 22:00 to 06:00)
    if (endMinutes < startMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
    
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
  
  /**
   * Get total minutes since start of day
   */
  getTotalMinutes() {
    return this.totalMinutes;
  }
  
  /**
   * Get full timestamp
   */
  getTimestamp() {
    return {
      day: this.day,
      dayName: this.getDayName(),
      hour: this.getHour(),
      minute: this.getMinute(),
      timeString: this.getTimeString(),
      time12Hour: this.getTime12Hour(),
      isWeekend: this.isWeekend()
    };
  }
  
  /**
   * Set time directly (for debugging/testing)
   */
  setTime(hour, minute = 0, day = null) {
    this.totalMinutes = hour * 60 + minute;
    if (day !== null) this.day = day;
  }
  
  /**
   * Serialize state for saving
   */
  serialize() {
    return {
      totalMinutes: this.totalMinutes,
      day: this.day
    };
  }
  
  /**
   * Restore state from save
   */
  deserialize(data) {
    this.totalMinutes = data.totalMinutes;
    this.day = data.day;
  }
}

export default TimeManager;
