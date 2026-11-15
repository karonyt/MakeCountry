export const DISTILLATION_TEMPERATURE_INCREASE = 20;

/** Distillation heats every reaction, regardless of its reaction type. */
export function calculateDistillationTemperature(temperature: number) {
    return temperature + DISTILLATION_TEMPERATURE_INCREASE;
}
