import { v2 as cloudinary } from 'cloudinary';

const primary = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const secondary = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY_2,
  api_secret: process.env.CLOUDINARY_API_SECRET_2,
};

if (!primary.cloud_name || !primary.api_key || !primary.api_secret) {
  console.error('[Cloudinary] Primary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
}

// Configure cloudinary initially with primary
cloudinary.config({
  cloud_name: primary.cloud_name,
  api_key: primary.api_key,
  api_secret: primary.api_secret,
  secure: true,
});

export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  folder?: string;
}

async function tryWithFallback<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (errPrimary) {
    // If secondary creds present, try with them
    if (secondary.api_key && secondary.api_secret) {
      try {
        cloudinary.config({
          cloud_name: secondary.cloud_name || primary.cloud_name,
          api_key: secondary.api_key,
          api_secret: secondary.api_secret,
          secure: true,
        });
        const res = await fn();
        // restore primary config
        cloudinary.config({
          cloud_name: primary.cloud_name,
          api_key: primary.api_key,
          api_secret: primary.api_secret,
          secure: true,
        });
        return res;
      } catch (errSecondary) {
        // restore primary config
        cloudinary.config({
          cloud_name: primary.cloud_name,
          api_key: primary.api_key,
          api_secret: primary.api_secret,
          secure: true,
        });
        throw errSecondary;
      }
    }
    throw errPrimary;
  }
}

export async function listImagesInFolder(
  folder: string,
  maxResults = 50
): Promise<CloudinaryResource[]> {
  try {
    const result = await tryWithFallback(() => cloudinary.api.resources({
      type: 'upload',
      prefix: folder.endsWith('/') ? folder : `${folder}/`,
      max_results: maxResults,
      resource_type: 'image',
    }));
    return (result.resources || []) as CloudinaryResource[];
  } catch (err: any) {
    console.error(`[Cloudinary] Failed to list images in folder "${folder}":`, err.message || err);
    return [];
  }
}

export async function listAllResources(
  prefix: string = 'otulia/',
  maxResults = 100
): Promise<CloudinaryResource[]> {
  try {
    const result = await tryWithFallback(() => cloudinary.api.resources({
      type: 'upload',
      prefix,
      max_results: maxResults,
      resource_type: 'image',
    }));
    return (result.resources || []) as CloudinaryResource[];
  } catch (err: any) {
    console.error(`[Cloudinary] Failed to list resources with prefix "${prefix}":`, err.message);
    return [];
  }
}

export async function searchResources(
  query: string,
  maxResults = 50
): Promise<CloudinaryResource[]> {
  try {
    const result = await tryWithFallback(() => cloudinary.search
      .expression(query)
      .sort_by('created_at', 'desc')
      .max_results(maxResults)
      .execute());
    return (result.resources || []) as CloudinaryResource[];
  } catch (err: any) {
    console.error(`[Cloudinary] Search failed for query "${query}":`, err.message);
    return [];
  }
}

export async function getResourceByPublicId(
  publicId: string
): Promise<CloudinaryResource | null> {
  try {
    const result = await tryWithFallback(() => cloudinary.api.resource(publicId, {
      resource_type: 'image',
    }));
    return result as unknown as CloudinaryResource;
  } catch (err: any) {
    console.error(`[Cloudinary] Failed to get resource "${publicId}":`, err.message);
    return null;
  }
}

export async function deleteResourcesByPrefix(
  prefix: string
): Promise<{ deleted: Record<string, string> }> {
  try {
    const result = await tryWithFallback(() => cloudinary.api.delete_resources_by_prefix(prefix, {
      resource_type: 'image',
    }));
    return result;
  } catch (err: any) {
    console.error(`[Cloudinary] Failed to delete by prefix "${prefix}":`, err.message);
    return { deleted: {} };
  }
}

export async function getFolderStructure(
  prefix: string = 'otulia/listings/'
): Promise<Record<string, CloudinaryResource[]>> {
  const resources = await listAllResources(prefix, 500);
  const folderMap: Record<string, CloudinaryResource[]> = {};

  for (const resource of resources) {
    const folder = resource.folder || 'root';
    if (!folderMap[folder]) {
      folderMap[folder] = [];
    }
    folderMap[folder].push(resource);
  }

  return folderMap;
}

export default cloudinary;
