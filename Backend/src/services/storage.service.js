import ImageKit, { toFile } from "@imagekit/nodejs";
import config from "../config/config.js";

const FOLDER = "Snitch";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, 
});

async function uploadFile({ buffer, fileName }) {
  const res = await client.files.upload({
    file: await toFile(buffer),
    fileName: fileName,
    folder: FOLDER,
  });

  return res;
}


export const deleteFileByUrl = async (url) => {
  try {
    if (!url) return;

    const cleanUrl = url.split("?")[0];
    const fileName = decodeURIComponent(cleanUrl.split("/").pop());

    console.log("[ImageKit delete] url:", cleanUrl);
    console.log("[ImageKit delete] searching name:", fileName);

    const result = await client.assets.list({
      searchQuery: `name = "${fileName}"`,
      limit: 10,
    });

    const assets = Array.isArray(result) ? result : (result?.data ?? []);

    console.log("[ImageKit delete] assets found:", assets.length);


    const file = assets.find(
      (a) => a.type === "file" && a.url?.split("?")[0] === cleanUrl,
    );

    if (!file) {
      console.log("[ImageKit delete] no matching file, skipped");
      return;
    }

    await client.files.delete(file.fileId);
    console.log("[ImageKit delete] deleted fileId:", file.fileId);
  } catch (error) {

    console.error("[ImageKit delete] failed:", error);
  }
};


export const deleteImage = async ({ url, fileId }) => {
  if (fileId) {
    try {
      await client.files.delete(fileId);
      console.log("[ImageKit delete] deleted fileId:", fileId);
    } catch (error) {
      console.error("[ImageKit delete] failed for fileId", fileId, error);
    }
    return;
  }

  await deleteFileByUrl(url);
};

export default uploadFile;