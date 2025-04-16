/**
 * Format date for display
 * @param dateString ISO date string
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
    dateString: string, 
    options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
  ): string => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  /**
   * Format number with thousands separators
   * @param value Number to format
   * @returns Formatted number string
   */
  export const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };
  
  /**
   * Truncate text to specified length and add ellipsis if needed
   * @param text Text to truncate
   * @param length Maximum length
   * @returns Truncated text
   */
  export const truncateText = (text: string, length: number): string => {
    if (!text) return '';
    if (text.length <= length) return text;
    
    return text.slice(0, length) + '...';
  };
  
  /**
   * Format token usage for display
   * @param tokens Number of tokens
   * @returns Formatted token string
   */
  export const formatTokens = (tokens: number): string => {
    if (tokens < 1000) return tokens.toString();
    
    return (tokens / 1000).toFixed(1) + 'k';
  };
  
  /**
   * Convert camelCase to Title Case
   * @param camelCase camelCase string
   * @returns Title Case string
   */
  export const camelToTitleCase = (camelCase: string): string => {
    if (!camelCase) return '';
    
    const result = camelCase.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };