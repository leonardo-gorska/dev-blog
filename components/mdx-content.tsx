/* eslint-disable @typescript-eslint/no-explicit-any */
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Box, Heading, Text, Code, Kbd, Separator, Link } from "@chakra-ui/react";
import React from "react";

// Theming custom components using Chakra UI v3
const components: Record<string, React.ComponentType<any>> = {
  h1: (props: any) => <Heading as="h1" size="2xl" mt={8} mb={4} {...props} />,
  h2: (props: any) => <Heading as="h2" size="xl" mt={8} mb={4} {...props} />,
  h3: (props: any) => <Heading as="h3" size="lg" mt={6} mb={3} {...props} />,
  h4: (props: any) => <Heading as="h4" size="md" mt={6} mb={3} {...props} />,
  p: (props: any) => <Text mb={4} lineHeight="tall" {...props} />,
  a: (props: any) => <Link color="blue.500" _hover={{ textDecoration: "underline" }} {...props} />,
  ul: (props: any) => <Box as="ul" pl={8} mb={4} {...props} />,
  ol: (props: any) => <Box as="ol" pl={8} mb={4} {...props} />,
  li: (props: any) => <Box as="li" mb={2} {...props} />,
  hr: (props: any) => <Separator my={8} {...props} />,
  code: (props: any) => {
    // If it's a code block output by rehype-pretty-code, we render it directly
    if (props.className?.includes("language-")) {
      return <code {...props} />;
    }
    // Inline code styling
    return <Code colorPalette="blue" px={1} py={0.5} borderRadius="md" {...props} />;
  },
  pre: (props: any) => (
    <Box
      as="pre"
      p={4}
      my={4}
      rounded="md"
      overflowX="auto"
      bg="gray.800"
      color="gray.100"
      fontSize="sm"
      {...props}
    />
  ),
  kbd: (props: any) => <Kbd {...props} />,
  blockquote: (props: any) => (
    <Box
      as="blockquote"
      borderLeftWidth={4}
      borderLeftColor="blue.500"
      pl={4}
      py={2}
      my={4}
      color="gray.500"
      bg="gray.50"
      _dark={{ color: "gray.400", bg: "whiteAlpha.100" }}
      roundedRight="md"
      {...props}
    />
  ),
};

const rehypePrettyCodeOptions = {
  theme: "one-dark-pro",
  keepBackground: false,
};

export async function MDXContent({ source }: { source: string }) {
  return (
    <Box className="mdx-content">
      <MDXRemote
        source={source}
        components={components as any}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypePrettyCode as any, rehypePrettyCodeOptions],
            ],
          },
        }}
      />
    </Box>
  );
}
