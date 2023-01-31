import {
  Heading,
  Divider,
  Center,
  Link,
  Text,
  VStack,
  Container,
} from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";

import * as Sentry from "@sentry/react";

export default function Error() {
  useEffect(() => {
    // Add an attachment
    Sentry.configureScope((scope) => {
      scope.setTransactionName("Error Page");
      scope.addAttachment({
        filename: "error_attachment.txt",
        data: "Attachment on Error Page",
      });
    });

    // Capture a "non Error" Message with an attachment
    Sentry.captureMessage("Error Page Message");
  }, []);

  return (
    <Center fontSize="1.2em">
      <VStack width="lg" spacing={4} align="left">
        <Container bg="gray.700" borderRadius={10} padding={5}>
          <Heading size="lg">Forced Error</Heading>
          <Text fontSize="1.2em">
            <Link color="pink.500" href="/">
              Go Home
            </Link>
          </Text>
        </Container>
      </VStack>
    </Center>
  );
}
