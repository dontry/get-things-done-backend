type mode = "hourly" | "daily" | "weekly" | "monthly" | "yearly";

export interface IRepeater {
  mode: mode;
  ends_on: number;
}
