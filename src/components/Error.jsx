import {
  Center,
  Container,
  Heading,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";


export default function Error() {
  useEffect(() => {
    throw new Error("Forced Error");
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
