import { ChatIcon, DeleteIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Heading,
  Divider,
  Center,
  Link,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  Text,
  VStack,
  Container,
} from "@chakra-ui/react";
import React from "react";

import * as Sentry from "@sentry/react";
Sentry.configureScope((scope) => scope.setTransactionName("About"));

export default function About() {
  return (
    <Center fontSize='1.2em'>
      <VStack width="lg" spacing={4} align="left" >
        <Container bg="gray.700" borderRadius={10} padding={5} >
          <Text fontSize='1.2em' >
            <Heading size="lg">This site was built using</Heading>
            <Link color="pink.500" href="https://github.com/" isExternal>
              Github
            </Link>
            ,{" "}
            <Link color="pink.500" href="https://railway.app/" isExternal>
              Railway
            </Link>
            ,{" "}
            <Link color="pink.500" href="https://vitejs.dev/" isExternal>
              Vite
            </Link>
            ,{" "}
            <Link
              color="pink.500"
              href="https://fastapi.tiangolo.com/"
              isExternal
            >
              FastAPI
            </Link>
            ,{" "}
            <Link
              color="pink.500"
              href="https://www.postgresql.org/"
              isExternal
            >
              Postgres
            </Link>
            ,{" "}
            <Link
              color="pink.500"
              href="https://aws.amazon.com/rekognition/"
              isExternal
            >
              Amazon Rekognition
            </Link>
             ... <Text> and </Text>
            <Link color="pink.500" href="https://sentry.io" isExternal>
              Sentry
            </Link>
            , of course
          </Text>
        </Container>
        <Container bg="pink.800" borderRadius={10} padding={5}>
          <Heading size="lg">What's been instrumented?</Heading>
          <Text fontSize="lg">
            Vite & FastAPI have been instrumented with Sentry Error Monitoring
            and Performance Tracking.
          </Text>
        </Container>
        <Container bg="gray.700" borderRadius={10} padding={5} fontSize='1.2em'>
          <Heading size="lg">Quick Instructions</Heading>
          <OrderedList>
            <ListItem>Upload a picture.</ListItem>
            <ListItem>If your pic contains the word "Error" or "Errors" or contains
              an image identified as a "Bug", the FASTApi integration will issue
              an error.
            </ListItem>
            <ListItem>Then try clicking a button</ListItem>
            <Divider margin={5} size="md" />
          </OrderedList>
            <Text>
              <WarningIcon color="yellow.500"></WarningIcon>
              {" - "}
              sends an Error with your Image Name + Labels to Sentry.
            </Text>
            <Text>
              <ChatIcon color="yellow.500"></ChatIcon>
              {" - "}
              traps an Unhandled Error with Feedback.
            </Text>
            <Text>
              <DeleteIcon color="red.500"></DeleteIcon>
              {" - "}
              deletes a picture.
            </Text>
        </Container>
        <Container bg="green.900" borderRadius={10} padding={5} fontSize='1.2em'>
          <Heading size="lg">Check out your data</Heading>
          <Text>
            Login to{" "}
            <Link href="https://sentry.io" isExternal>
              Sentry.io
            </Link>{" "}
            to see your Errors, Perf and Feedback
          </Text>
          to see your Error(s) and browse Performance Data!
          <Text>
            <Text>Login Using</Text>ID: demo@quickstark.com <br></br>PW:
            @Sentry2022
          </Text>
        </Container>
      </VStack>
    </Center>
  );
}
