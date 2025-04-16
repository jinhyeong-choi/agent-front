export interface User {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    is_active: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
    token_balance: number;
  }
  
  export interface UserUpdateRequest {
    email?: string;
    username?: string;
    full_name?: string;
    password?: string;
    is_active?: boolean;
  }
  
  export interface LoginRequest {
    username: string; // Can be either username or email
    password: string;
  }
  
  export interface RegistrationRequest {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }
  
  export interface PasswordUpdate {
    current_password: string;
    new_password: string;
  }
  
  export interface TokenPurchase {
    amount: number;
    payment_method: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    expires: number | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }