/**
 * Validate email format
 * @param email Email to validate
 * @returns Whether email is valid
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password strength
   * @param password Password to validate
   * @returns Validation result object
   */
  export const validatePassword = (password: string): { 
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Validate URL format
   * @param url URL to validate
   * @returns Whether URL is valid
   */
  export const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  /**
   * Validate form fields
   * @param fields Object with field names and values
   * @param requiredFields Array of required field names
   * @returns Object with field errors
   */
  export const validateForm = (
    fields: Record<string, any>,
    requiredFields: string[] = []
  ): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Check required fields
    for (const field of requiredFields) {
      const value = fields[field];
      if (value === undefined || value === null || value === '') {
        errors[field] = `${field} is required`;
      }
    }
    
    // Validate email if present
    if (fields.email !== undefined && fields.email !== '') {
      if (!isValidEmail(fields.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    return errors;
  };