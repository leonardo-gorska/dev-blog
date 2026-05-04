import { Box, Heading, Text, Container, Stack, Card } from "@chakra-ui/react";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <Container py={10} maxW="container.md">
      <Box textAlign="center" mb={12}>
        <Heading as="h1" size="2xl" mb={4}>
          Dev Blog
        </Heading>
        <Text fontSize="xl" color="gray.500">
          Explorando engenharia de software, arquiteturas cloud-native e alta performance.
        </Text>
      </Box>

      <Stack gap={6}>
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} style={{ textDecoration: 'none' }}>
            <Card.Root _hover={{ transform: "translateY(-2px)", shadow: "md", transition: "all 0.2s" }}>
              <Card.Body>
                <Heading size="lg" mb={2}>{post.title}</Heading>
                <Text color="gray.500" fontSize="sm" mb={3}>{new Date(post.date).toLocaleDateString('pt-BR')}</Text>
                <Text>{post.description}</Text>
              </Card.Body>
            </Card.Root>
          </Link>
        ))}
        {posts.length === 0 && (
          <Text textAlign="center" color="gray.500">Nenhum artigo publicado ainda.</Text>
        )}
      </Stack>
    </Container>
  );
}
