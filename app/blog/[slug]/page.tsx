import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/mdx-content";
import { Box, Container, Heading, Badge, Text } from "@chakra-ui/react";
import type { Metadata } from "next";

// This is the core piece of Next.js for SSG (Static Site Generation)
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Technical SEO implementation using Next.js Metadata API
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Artigo não encontrado | Dev Blog" };
  }

  return {
    title: `${post.metadata.title} | Dev Blog`,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      type: "article",
      publishedTime: post.metadata.date,
      authors: ["Seu Nome Aqui"], // Substitua pelo seu nome
      tags: post.metadata.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metadata.title,
      description: post.metadata.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // JSON-LD implementation for technical SEO indexation
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    datePublished: post.metadata.date,
    dateModified: post.metadata.date,
    description: post.metadata.description,
    author: {
      "@type": "Person",
      name: "Seu Nome Aqui", // Substitua pelo seu nome
    },
  };

  return (
    <Box as="article" py={12}>
      {/* Inject Structured Data into Head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Container maxW="container.md">
        <Box mb={10} textAlign="center">
          <Box mb={4}>
             {post.metadata.tags.map((tag) => (
                <Badge key={tag} colorPalette="blue" mr={2} size="lg">
                  {tag}
                </Badge>
              ))}
          </Box>
          <Heading as="h1" size="3xl" mb={4} lineHeight="shorter">
            {post.metadata.title}
          </Heading>
          <Text color="gray.500" fontSize="lg">
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "full",
            }).format(new Date(post.metadata.date))}
          </Text>
        </Box>

        <MDXContent source={post.content} />
      </Container>
    </Box>
  );
}
