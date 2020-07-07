export class SomethingToSayValidator {
  static isSomethingInvalid(something: string): boolean {
    return /[^a-z0-9]+/i.test(something)
  }
}
