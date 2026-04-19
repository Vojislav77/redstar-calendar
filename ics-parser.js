/**
 * Lightweight iCal (.ics) parser for Google Calendar public feeds
 * No external dependencies - pure JavaScript
 */

function parseICS(icsText) {
  const events = [];
  const lines = icsText.split(/\r\n|\n|\r/);
  
  let currentEvent = null;
  let inEvent = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle line folding (RFC 5545)
    while (i + 1 < lines.length && lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t')) {
      line += lines[i + 1].substring(1);
      i++;
    }
    
    // Parse VEVENT blocks
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {
        title: '',
        description: '',
        location: '',
        start: null,
        end: null,
        uid: ''
      };
      continue;
    }
    
    if (line === 'END:VEVENT' && inEvent) {
      inEvent = false;
      if (currentEvent.start && currentEvent.title) {
        events.push(currentEvent);
      }
      currentEvent = null;
      continue;
    }
    
    if (!inEvent || !currentEvent) continue;
    
    // Parse event properties
    if (line.startsWith('SUMMARY:')) {
      currentEvent.title = decodeICSValue(line.substring(8));
    }
    else if (line.startsWith('DESCRIPTION:')) {
      currentEvent.description = decodeICSValue(line.substring(12));
    }
    else if (line.startsWith('LOCATION:')) {
      currentEvent.location = decodeICSValue(line.substring(9));
    }
    else if (line.startsWith('UID:')) {
      currentEvent.uid = line.substring(4);
    }
    else if (line.startsWith('DTSTART')) {
      currentEvent.start = parseICSDate(line);
    }
    else if (line.startsWith('DTEND')) {
      currentEvent.end = parseICSDate(line);
    }
  }
  
  return events;
}

function decodeICSValue(value) {
  // Unescape iCal special characters
  return value
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\n/g, '\n')
    .replace(/\\\\/g, '\\');
}

function parseICSDate(line) {
  // Extract date value and parameters
  const match = line.match(/DTSTART(?:;[^:]+)?:(.+)/);
  if (!match) return null;
  
  let dateStr = match[1].trim();
  
  // Handle timezone parameter
  const tzMatch = line.match(/TZID=([^;:]+)/);
  const hasTime = dateStr.includes('T');
  
  if (hasTime) {
    // Format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
    dateStr = dateStr.replace('Z', ''); // Remove Z (UTC)
    
    // Parse: YYYY-MM-DDTHH:MM:SS
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(9, 11) || '00';
    const minute = dateStr.substring(11, 13) || '00';
    const second = dateStr.substring(13, 15) || '00';
    
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  } else {
    // All-day event: YYYYMMDD
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return new Date(`${year}-${month}-${day}T00:00:00`);
  }
}

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseICS };
}