import fs from "fs"
import path from "path"
import matter from "gray-matter"

const rootDirectory = path.join(process.cwd(), "content", "posts")

export type PostMetadata = {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
}

export type Post = {
  metadata: PostMetadata
  content: string
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const realSlug = slug.replace(/\.mdx$/, "")
    const filePath = path.join(rootDirectory, `${realSlug}.mdx`)
    const fileContent = fs.readFileSync(filePath, "utf8")

    const { data, content } = matter(fileContent)

    return {
      metadata: {
        slug: realSlug,
        title: data.title || "",
        date: data.date || "",
        tags: data.tags || [],
        description: data.description || "",
      },
      content,
    }
  } catch {
    return null
  }
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  if (!fs.existsSync(rootDirectory)) {
    return []
  }

  const files = fs.readdirSync(rootDirectory)
  const posts: PostMetadata[] = []

  for (const file of files) {
    if (file.endsWith(".mdx")) {
      const slug = file.replace(/\.mdx$/, "")
      const post = await getPostBySlug(slug)
      if (post) {
        posts.push(post.metadata)
      }
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
