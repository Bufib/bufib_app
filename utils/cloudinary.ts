// cloudinary.js
import { Cloudinary } from "@cloudinary/url-gen";

export const CLOUD_NAME = "dcl4xe1vw";
export const cld = new Cloudinary({
  cloud: { cloudName: CLOUD_NAME },
  url: { secure: true },
});
