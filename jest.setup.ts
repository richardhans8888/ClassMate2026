import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "node:util";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  // @ts-expect-error: node TextDecoder type is not fully compatible with the DOM TextDecoder type
  global.TextDecoder = TextDecoder;
}
