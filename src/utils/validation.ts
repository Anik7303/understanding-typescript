namespace App {
  export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  export function validate(validatableValue: Validatable): boolean {
    const { value } = validatableValue;
    let isValid = true;

    if (validatableValue.required) {
      isValid = isValid && value.toString().trim().length > 0;
    }
    if (validatableValue.minLength != null && typeof value === "string") {
      isValid = isValid && value.trim().length >= validatableValue.minLength;
    }
    if (validatableValue.maxLength != null && typeof value === "string") {
      isValid = isValid && value.trim().length <= validatableValue.maxLength;
    }
    if (validatableValue.min != null && typeof value === "number") {
      isValid = isValid && value >= validatableValue.min;
    }
    if (validatableValue.max != null && typeof value === "number") {
      isValid = isValid && value <= validatableValue.max;
    }

    return isValid;
  }
}
