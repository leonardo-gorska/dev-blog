import { Box, Heading, Text, Container } from "@chakra-ui/react";

export default function Home() {
  return (
    <Container py={10}>
      <Box textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Bem-vindo ao Dev Blog Mestre
        </Heading>
        <Text fontSize="xl" color="gray.500">
          Explorando Next.js 15, MDX Engine e alta performance.
        </Text>
      </Box>
    </Container>
  );
}
