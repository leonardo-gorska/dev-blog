"use client"

import { Box, Container, Flex, Link, Text } from "@chakra-ui/react"

export default function SiteFooter() {
  return (
    <Box as="footer" borderTop="1px solid" borderColor="gray.700" mt={16} py={6}>
      <Container maxW="container.md">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} Leonardo Gorska
          </Text>
          <Flex gap={6} flexWrap="wrap" justify="center">
            <Link
              href="https://portfolio-kohl-six-45.vercel.app"
              target="_blank"
              fontSize="sm"
              color="gray.400"
              _hover={{ color: "white" }}
            >
              🌐 Portfolio
            </Link>
            <Link
              href="https://github.com/leonardo-gorska"
              target="_blank"
              fontSize="sm"
              color="gray.400"
              _hover={{ color: "white" }}
            >
              🐙 GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/leonardo-gorska"
              target="_blank"
              fontSize="sm"
              color="gray.400"
              _hover={{ color: "white" }}
            >
              💼 LinkedIn
            </Link>
            <Link
              href="https://fintrack-rust-two.vercel.app"
              target="_blank"
              fontSize="sm"
              color="gray.400"
              _hover={{ color: "white" }}
            >
              📊 FinTrack
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
