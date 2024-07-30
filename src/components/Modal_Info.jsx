import { ChatIcon, DeleteIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Link,
  Modal,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import React from "react";

export default function Modal_Info({ isOpen, onOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>What is this supposed to be anyway?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="lg">
            This site was built using<br></br>
            <Link href="https://github.com/" isExternal>
              Github
            </Link>
            ,{" "}
            <Link href="https://railway.app/" isExternal>
              Railway
            </Link>
            ,{" "}
            <Link href="https://vitejs.dev/" isExternal>
              Vite
            </Link>
            ,{" "}
            <Link href="https://fastapi.tiangolo.com/" isExternal>
              FastAPI
            </Link>
            ,{" "}
            <Link href="https://www.postgresql.org/" isExternal>
              Postgres
            </Link>
          </Text>
          <br></br>
          <VStack spacing={4} align="left">
            <Text fontSize="lg">
              Vite & FastAPI have been instrumented Error Monitoring
              and Performance Monitoring.
            </Text>
            <Text>1. Upload a picture.</Text>
            <Text>
              2. If your pic contains the word "Error" or "Errors", the FASTApi
              integration will issue an error.
            </Text>
            <Text>3. Then try clicking a button</Text>
            <Text>
              <WarningIcon></WarningIcon>
              {" - "}
              button to send an Error with your Image Name and Labels.
            </Text>
            <Text>
              <ChatIcon></ChatIcon>
              {" - "}
              button to trap an Unhandled Error with Feedback.
            </Text>
            <Text>
              <DeleteIcon></DeleteIcon>
              {" - "}
              button to delete a picture.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="yellow" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
