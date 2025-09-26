// Security utilities for handling sensitive data
export const sanitizeInput = (input: string): string => {
  // Remove any potentially harmful characters
  return input.replace(/[<>\"'&]/g, '');
};

export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cleaned;

  const firstFour = cleaned.substring(0, 4);
  const lastFour = cleaned.substring(cleaned.length - 4);
  const masked = '*'.repeat(Math.max(0, cleaned.length - 8));

  return `${firstFour}${masked}${lastFour}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const generateSecureToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Secure data encryption (basic implementation for demo)
// In production, use proper encryption libraries
export const encryptData = (data: string, key: string): string => {
  // This is a basic Caesar cipher for demo purposes
  // In production, use proper encryption like AES
  const shift = key.length % 26;
  return data.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const base = code >= 65 && code <= 90 ? 65 : 97;
    return String.fromCharCode(((code - base + shift) % 26) + base);
  });
};

export const decryptData = (data: string, key: string): string => {
  // Reverse Caesar cipher
  const shift = key.length % 26;
  return data.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const base = code >= 65 && code <= 90 ? 65 : 97;
    return String.fromCharCode(((code - base - shift + 26) % 26) + base);
  });
};
