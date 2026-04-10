/**
 * Escapes a string for safe inclusion in HTML content.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes a string for safe use in an email subject line.
 * Strips CRLF and other control characters to prevent header injection.
 */
function sanitizeSubject(str) {
  return String(str).replace(/[\r\n\t\x00-\x1f\x7f]/g, ' ').trim();
}

module.exports = { escapeHtml, sanitizeSubject };
