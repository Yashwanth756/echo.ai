
import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  endContent?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, showPasswordToggle, endContent, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    // Only handle password toggling if it's a password field
    const isPasswordField = type === 'password';
    const shouldShowPasswordToggle = showPasswordToggle && isPasswordField;
    
    // Determine the actual type to use
    const inputType = isPasswordField && showPassword ? 'text' : type;
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    
    return (
      <div className={cn("relative flex items-center")}>
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
            icon && "pl-10",
            (shouldShowPasswordToggle || endContent) && "pr-10", 
            className
          )}
          ref={ref}
          {...props}
        />
        
        {shouldShowPasswordToggle && (
          <button 
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        )}
        
        {endContent && !shouldShowPasswordToggle && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {endContent}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
