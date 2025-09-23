// Type definitions for class-variance-authority
declare module 'class-variance-authority' {
  import * as React from 'react';

  type ClassValue = string | number | boolean | undefined | null;
  type ClassDictionary = Record<string, unknown>;
  type ClassArray = ClassValue[];
  
  type ClassProp = ClassValue | ClassDictionary | ClassArray;
  
  interface ClassPropObject {
    [key: string]: boolean | undefined | null;
  }
  
  type ClassPropValue = string | ClassPropObject | ClassPropArray | undefined | null | false;
  
  interface ClassPropArray extends Array<ClassPropValue> {}
  
  export type VariantProps<Component extends (...args: any) => any> = {
    [Key in keyof Parameters<Component>[0]]: string;
  };
  
  export type VariantOptions = {
    [key: string]: {
      [key: string]: string;
    };
  };
  
  export function cva<T extends VariantOptions>(
    base: string,
    config?: {
      variants?: T;
      defaultVariants?: { [K in keyof T]?: keyof T[K] };
      compoundVariants?: Array<{
        [K in keyof T]?: keyof T[K];
      } & { class: string }>;
    } = {}
  ): (props?: { [K in keyof T]?: keyof T[K] } & { class?: string }) => string;
  
  export interface VariantProps<Component extends (...args: any) => any> {
    className?: string;
    [key: string]: any;
  }
}

// Type definitions for react-hook-form
declare module 'react-hook-form' {
  import * as React from 'react';

  export type FieldValues = Record<string, any>;
  
  export type UseFormReturn<TFieldValues extends FieldValues = FieldValues> = {
    register: (name: string, options?: any) => any;
    handleSubmit: (onSubmit: (data: TFieldValues) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    formState: {
      errors: Record<string, { message?: string; type: string }>;
      isSubmitting: boolean;
      isSubmitted: boolean;
      isSubmitSuccessful: boolean;
      isValid: boolean;
      isValidating: boolean;
      submitCount: number;
      touchedFields: Record<string, boolean>;
      isDirty: boolean;
      dirtyFields: Record<string, boolean>;
    };
    control: any;
    watch: (name?: string | string[]) => any;
    setValue: (name: string, value: any, config?: { shouldValidate?: boolean; shouldDirty?: boolean }) => void;
    getValues: (payload?: string | string[]) => any;
    reset: (values?: TFieldValues) => void;
    trigger: (name?: string | string[]) => Promise<boolean>;
  };

  export function useForm<TFieldValues extends FieldValues = FieldValues>(
    options?: {
      defaultValues?: TFieldValues;
      resolver?: any;
      mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
      reValidateMode?: 'onBlur' | 'onChange' | 'onSubmit';
      criteriaMode?: 'firstError' | 'all';
      shouldFocusError?: boolean;
      shouldUnregister?: boolean;
      shouldUseNativeValidation?: boolean;
      delayError?: number;
    }
  ): UseFormReturn<TFieldValues>;

  export function Controller<TFieldValues extends FieldValues = FieldValues>({
    control,
    name,
    rules,
    defaultValue,
    render,
  }: {
    control: any;
    name: string;
    rules?: any;
    defaultValue?: any;
    render: (props: {
      field: {
        onChange: (value: any) => void;
        onBlur: () => void;
        value: any;
        name: string;
        ref: React.Ref<any>;
      };
      fieldState: {
        invalid: boolean;
        isTouched: boolean;
        isDirty: boolean;
        error?: { message?: string; type: string };
      };
      formState: any;
    }) => React.ReactElement;
  }): React.ReactElement;

  export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): UseFormReturn<TFieldValues>;
  
  export function useController<TFieldValues extends FieldValues = FieldValues>({
    name,
    control,
    rules,
    defaultValue,
  }: {
    name: string;
    control?: any;
    rules?: any;
    defaultValue?: any;
  }): {
    field: {
      onChange: (value: any) => void;
      onBlur: () => void;
      value: any;
      name: string;
      ref: React.Ref<any>;
    };
    fieldState: {
      invalid: boolean;
      isTouched: boolean;
      isDirty: boolean;
      error?: { message?: string; type: string };
    };
    formState: any;
  };
}

// Type definitions for date-fns
declare module 'date-fns' {
  export function format(date: Date | number, format: string, options?: {
    locale?: any;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: number;
    useAdditionalWeekYearTokens?: boolean;
    useAdditionalDayOfYearTokens?: boolean;
  }): string;

  export function addDays(date: Date | number, amount: number): Date;
  export function addWeeks(date: Date | number, amount: number): Date;
  export function addMonths(date: Date | number, amount: number): Date;
  export function addYears(date: Date | number, amount: number): Date;
  
  export function subDays(date: Date | number, amount: number): Date;
  export function subWeeks(date: Date | number, amount: number): Date;
  export function subMonths(date: Date | number, amount: number): Date;
  export function subYears(date: Date | number, amount: number): Date;
  
  export function isBefore(date: Date | number, dateToCompare: Date | number): boolean;
  export function isAfter(date: Date | number, dateToCompare: Date | number): boolean;
  export function isEqual(date: Date | number, dateToCompare: Date | number): boolean;
  export function isSameDay(date: Date | number, dateToCompare: Date | number): boolean;
  export function isSameMonth(date: Date | number, dateToCompare: Date | number): boolean;
  export function isSameYear(date: Date | number, dateToCompare: Date | number): boolean;
  
  export function parseISO(argument: string, options?: {
    additionalDigits?: 0 | 1 | 2;
  }): Date;
  
  export function parse(argument: string, format: string, referenceDate: Date | number, options?: {
    locale?: any;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: number;
    useAdditionalDayOfYearTokens?: boolean;
    useAdditionalWeekYearTokens?: boolean;
  }): Date;
  
  export function getDaysInMonth(date: Date | number): number;
  export function getDate(date: Date | number): number;
  export function getDay(date: Date | number): number;
  export function getMonth(date: Date | number): number;
  export function getYear(date: Date | number): number;
  
  export function setDate(date: Date | number, day: number): Date;
  export function setMonth(date: Date | number, month: number): Date;
  export function setYear(date: Date | number, year: number): Date;
  
  export function startOfDay(date: Date | number): Date;
  export function endOfDay(date: Date | number): Date;
  export function startOfWeek(date: Date | number, options?: {
    locale?: any;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }): Date;
  export function endOfWeek(date: Date | number, options?: {
    locale?: any;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }): Date;
  export function startOfMonth(date: Date | number): Date;
  export function endOfMonth(date: Date | number): Date;
  export function startOfYear(date: Date | number): Date;
  export function endOfYear(date: Date | number): Date;
  
  export function differenceInDays(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInWeeks(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInMonths(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInYears(dateLeft: Date | number, dateRight: Date | number): number;
  
  export function formatDistance(date: Date | number, baseDate: Date | number, options?: {
    includeSeconds?: boolean;
    addSuffix?: boolean;
    locale?: any;
  }): string;
  
  export function formatRelative(date: Date | number, baseDate: Date | number, options?: {
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    locale?: any;
  }): string;
  
  export function isToday(date: Date | number): boolean;
  export function isThisMonth(date: Date | number): boolean;
  export function isThisYear(date: Date | number): boolean;
  
  export function isValid(date: any): boolean;
  
  export const enUS: any;
  export const eo: any;
  export const ru: any;
  export const zhCN: any;
  export const zhTW: any;
}
