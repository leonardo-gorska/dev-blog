import { getAllPosts } from "@/lib/mdx";
import { Box, Container, Heading, SimpleGrid, Badge, Text } from "@chakra-ui/react";
import Link from "next/link";

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <Container maxW="container.md" py={10}>
      <Heading as="h1" size="2xl" mb={8} textAlign="center">
        Tópicos de Fronteira
      </Heading>
      <Text fontSize="lg" color="gray.500" textAlign="center" mb={12}>
        Artigos focados em engenharia de software e performance.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 1 }} gap={8}>
        {posts.map((post) => (
          <Box
            key={post.slug}
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            transition="all 0.2s"
            _hover={{
              shadow: "md",
              transform: "translateY(-4px)",
              borderColor: "blue.400",
            }}
          >
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <Box mb={2}>
                {post.tags.map((tag) => (
                  <Badge key={tag} colorPalette="blue" mr={2}>
                    {tag}
                  </Badge>
                ))}
              </Box>
              <Heading as="h2" size="lg" mb={2} _dark={{ color: "white" }}>
                {post.title}
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }} mb={4}>
                {post.description}
              </Text>
              <Text fontSize="sm" color="gray.400">
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "medium",
                }).format(new Date(post.date))}
              </Text>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}
