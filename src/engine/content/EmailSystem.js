/**
 * Email content loading and delivery system
 */

import { gameState } from '../../stores/gameState.js';
import { get } from 'svelte/store';

// Import all email templates
const emailTemplates = import.meta.glob('/src/content/emails/**/*.json', { eager: true });

/**
 * Get all available email templates
 */
export function getAllEmailTemplates() {
  const templates = [];
  
  for (const [path, data] of Object.entries(emailTemplates)) {
    const template = data.default || data;
    templates.push({
      path,
      ...template
    });
  }
  
  return templates;
}

/**
 * Get a specific email template by ID
 */
export function getEmailTemplate(templateId) {
  for (const [path, data] of Object.entries(emailTemplates)) {
    const template = data.default || data;
    if (template.id === templateId) {
      return template;
    }
  }
  return null;
}

/**
 * Send an email to the current player
 * @param {object} emailData - Email data (from template or custom)
 */
export function sendEmail(emailData) {
  const state = get(gameState);
  if (!state.currentAccount) return;

  const account = state.currentAccount;
  
  // Process template variables
  const processedEmail = processEmailTemplate(emailData, account);
  
  // Create email instance
  const email = {
    id: crypto.randomUUID(),
    templateId: emailData.id || null,
    from: processedEmail.from,
    subject: processedEmail.subject,
    body: processedEmail.body,
    attachments: processedEmail.attachments || [],
    receivedAt: new Date().toISOString(),
    read: false
  };

  // Add to account emails
  const updatedEmails = [...(account.emails || []), email];
  
  gameState.updateAccount({
    emails: updatedEmails,
    unreadEmails: updatedEmails.filter(e => !e.read).length
  });

  return email;
}

/**
 * Send an email from a template ID
 */
export function sendEmailFromTemplate(templateId) {
  const template = getEmailTemplate(templateId);
  if (!template) {
    console.error(`Email template not found: ${templateId}`);
    return null;
  }
  return sendEmail(template);
}

/**
 * Process template variables in email content
 */
function processEmailTemplate(template, account) {
  const variables = {
    '{firstName}': account.firstName,
    '{lastName}': account.lastName,
    '{fullName}': `${account.firstName} ${account.lastName}`,
    '{username}': account.username,
    '{email}': account.email,
    '{credits}': account.credits?.toString() || '0',
    '{clearanceLevel}': account.clearanceLevel?.toString() || '1',
  };

  const processString = (str) => {
    if (!str) return str;
    let result = str;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    return result;
  };

  return {
    ...template,
    subject: processString(template.subject),
    body: processString(template.body),
    from: template.from
  };
}

/**
 * Check and deliver any pending emails based on triggers
 */
export function deliverPendingEmails() {
  const state = get(gameState);
  if (!state.currentAccount) return;

  const account = state.currentAccount;
  const existingTemplateIds = (account.emails || [])
    .map(e => e.templateId)
    .filter(Boolean);

  const templates = getAllEmailTemplates();

  for (const template of templates) {
    // Skip if already sent
    if (existingTemplateIds.includes(template.id)) {
      continue;
    }

    // Check trigger conditions
    if (shouldTriggerEmail(template, account)) {
      sendEmail(template);
    }
  }
}

/**
 * Check if an email should be triggered based on conditions
 */
function shouldTriggerEmail(template, account) {
  const trigger = template.trigger;
  
  if (!trigger) return false;

  switch (trigger.type) {
    case 'immediate':
      // Send immediately when conditions are met
      return checkConditions(trigger.conditions, account);
    
    case 'onFirstLogin':
      // Send on first login (no emails yet)
      return (account.emails || []).length === 0;
    
    case 'onFlag':
      // Send when a specific flag is set
      return account.flags?.[trigger.flag] === true;
    
    case 'onClearance':
      // Send when clearance level is reached
      return account.clearanceLevel >= trigger.level;
    
    case 'onShift':
      // Send when a specific shift is reached
      return account.currentShift >= trigger.shift;
    
    default:
      return false;
  }
}

/**
 * Check additional conditions
 */
function checkConditions(conditions, account) {
  if (!conditions) return true;
  
  for (const condition of conditions) {
    switch (condition.type) {
      case 'flag':
        if (account.flags?.[condition.flag] !== condition.value) {
          return false;
        }
        break;
      case 'clearance':
        if (account.clearanceLevel < condition.level) {
          return false;
        }
        break;
      // Add more condition types as needed
    }
  }
  
  return true;
}

/**
 * Manually trigger emails by flag
 */
export function triggerEmailsByFlag(flag) {
  const state = get(gameState);
  if (!state.currentAccount) return;

  // Set the flag
  gameState.updateAccount({
    flags: {
      ...state.currentAccount.flags,
      [flag]: true
    }
  });

  // Deliver any emails triggered by this flag
  deliverPendingEmails();
}

// ============================================
// DEV TOOLS - Remove or disable for production
// ============================================

/**
 * [DEV] Reset all emails for current account and re-trigger
 * Useful when editing email templates during development
 */
export function devResetEmails() {
  const state = get(gameState);
  if (!state.currentAccount) return;

  console.log('[DEV] Resetting all emails...');
  
  // Clear all emails
  gameState.updateAccount({
    emails: [],
    unreadEmails: 0
  });

  // Re-deliver pending emails
  setTimeout(() => {
    deliverPendingEmails();
    console.log('[DEV] Emails re-delivered.');
  }, 100);
}

/**
 * [DEV] Reset a specific email by template ID
 */
export function devResetEmail(templateId) {
  const state = get(gameState);
  if (!state.currentAccount) return;

  console.log(`[DEV] Resetting email: ${templateId}`);
  
  // Remove this specific email
  const filteredEmails = (state.currentAccount.emails || [])
    .filter(e => e.templateId !== templateId);
  
  gameState.updateAccount({
    emails: filteredEmails,
    unreadEmails: filteredEmails.filter(e => !e.read).length
  });

  // Re-deliver (will re-send if trigger conditions are met)
  setTimeout(() => {
    deliverPendingEmails();
  }, 100);
}

// Expose to window for console access during development
if (typeof window !== 'undefined') {
  window.devResetEmails = devResetEmails;
  window.devResetEmail = devResetEmail;
}
