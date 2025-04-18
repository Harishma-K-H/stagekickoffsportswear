interface SleeveCaseConfig {
  options: Array<{ value: string; label: string }>;
  isDisabled: boolean;
}

export const getSleeveCaseConfig = (
  modelName?: string,
  materialName?: any,
): SleeveCaseConfig => {
  // Default configuration
  const defaultConfig: SleeveCaseConfig = {
    options: [
      { value: 'FULL SLEEVE', label: 'FULL SLEEVE' },
      { value: 'SLEEVELESS', label: 'SLEEVELESS' },
      { value: 'HALF SLEEVE', label: 'HALF SLEEVE' },
    ],
    isDisabled: false,
  };

  // Models that don't need sleeves
  const MODELS_WITHOUT_SLEEVES = ['SHORTS', 'LOWER', 'CAP', 'FABRIC KIT'];

  // If no model name, return default config
  if (!modelName) return defaultConfig;

  const upperModelName = modelName.toUpperCase();

  // First check if model doesn't need sleeves at all
  if (MODELS_WITHOUT_SLEEVES.includes(upperModelName)) {
    return {
      options: [],
      isDisabled: true,
    };
  }

  // Special cases based on model and material combinations
  switch (upperModelName) {
    case 'JACKET':
      if (materialName == 'SUPER POLY') {
        // Example: Cotton material ID
        return {
          options: [
            { value: 'FULL SLEEVE', label: 'FULL SLEEVE' },
            { value: 'HALF SLEEVE', label: 'HALF SLEEVE' },
          ],
          isDisabled: false,
        };
      }
      if (materialName == 'NS LYCRA') {
        // Example: Polyester material ID
        return {
          options: [],
          isDisabled: true,
        };
      }
      break;
    // default:
    //     // Handle other models or materials if needed
    //     return defaultConfig;
  }

  // Return default configuration if no special cases match
  return defaultConfig;
};
