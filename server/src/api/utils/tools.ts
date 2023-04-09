import { ENV } from "../../config";

export function nextLetter(s: string) {
  return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, (a) => {
    let c = a.charCodeAt(0);
    switch (c) {
      case 90:
        return "A";
      case 122:
        return "a";
      default:
        return String.fromCharCode(++c);
    }
  });
}

export function hasSecretCode(command: string) {
  return command.includes(ENV.telegram.secretCode);
}

export function removeSecretCode(command: string) {
  return command.replace(ENV.telegram.secretCode, "");
}
