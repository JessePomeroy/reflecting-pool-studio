/**
 * Custom empty state component for document lists.
 *
 * Shown via the structure builder's async `.child()` when a document type
 * has zero published documents. Once the photographer creates their first
 * document and navigates back, the standard document list takes over.
 *
 * Receives its content via `options` from the structure builder:
 *   - title: heading text
 *   - description: body text explaining what the doc type is for
 *   - type: the schema type name (used for the create intent)
 */

import { AddDocumentIcon } from "@sanity/icons";
import { Box, Button, Card, Flex, Heading, Stack, Text } from "@sanity/ui";
import { useRouter } from "sanity/router";

interface EmptyStateOptions {
  title: string;
  description: string;
  type: string;
}

export function EmptyState(props: { options: EmptyStateOptions }) {
  const { title, description, type } = props.options;
  const router = useRouter();

  return (
    <Card padding={5} sizing="border">
      <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
        <Box style={{ maxWidth: 420, textAlign: "center" }}>
          <Stack space={4}>
            <Heading size={2}>{title}</Heading>
            <Text size={2} muted>
              {description}
            </Text>
            <Box>
              <Button
                icon={AddDocumentIcon}
                text="Create your first one"
                tone="primary"
                onClick={() => router.navigateIntent("create", { type })}
              />
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Card>
  );
}
