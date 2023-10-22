// for now i will throw an error, but i want a more robust can activate system
export class NotActivatedError extends Error {
  constructor() {
    super("Skill did not meet the activation criteria");
  }
}
