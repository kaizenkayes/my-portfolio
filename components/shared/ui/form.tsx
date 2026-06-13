import { cn } from "@/lib/utils";
import type { 
  InputHTMLAttributes, 
  LabelHTMLAttributes, 
  SelectHTMLAttributes, 
  TextareaHTMLAttributes 
} from "react";

export function FormLabel({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label 
      className={cn(className, "form-label")} 
      {...props}
    >
      {children}
    </label>
  );
}

export function FormInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={cn(className , "form-input")} 
      {...props} 
    />
  );
}

export function FormTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      className={cn(className, "form-textarea")} 
      {...props} 
    />
  );
}

export function FormSelect({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select 
      className={cn(className, "form-select")} 
      {...props}
    >
      {children}
    </select>
  );
}

export function FormCheckboxLabel({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label 
      className={cn(className, "form-checkbox-label")} 
      {...props}
    >
      {children}
    </label>
  );
}