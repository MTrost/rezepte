import { nanoid } from 'nanoid'

export interface UploadResult {
  key: string
  url: string
}

export async function uploadImage(
  r2: R2Bucket,
  file: File,
  folder: string = 'recipes'
): Promise<UploadResult> {
  const ext = file.name.split('.').pop() || 'jpg'
  const key = `${folder}/${nanoid()}.${ext}`

  await r2.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  })

  return {
    key,
    url: `/api/images/${key}`,
  }
}

export async function deleteImage(r2: R2Bucket, key: string): Promise<void> {
  await r2.delete(key)
}

export async function getImage(r2: R2Bucket, key: string): Promise<R2ObjectBody | null> {
  return r2.get(key)
}
