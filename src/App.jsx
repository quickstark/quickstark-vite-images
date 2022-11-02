import {
  ArrowUpIcon,
  ChatIcon,
  DeleteIcon,
  QuestionIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Center,
  ChakraProvider,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";

import axios from "axios";
import React from "react";

const brand = {
  dark_violet: "#362D59",
  light_violet: "#79628C",
  dark_purple: "#452650",
  flame: "#F4834F",
  pink: "#E1567C",
  gold: "#F1B71C",
  cyan: "#66C7C5",
  bg: "#181225",
};

const api_base_url = import.meta.env.VITE_API_BASE_URL;

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: "quickstark-react-images@0.0.1", //Need the release for sourcemaps
  integrations: [new BrowserTracing()],
  routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Check if it is an exception, and if so, show the report dialog
    console.log(event, hint);

    if (event.exception.values[0].value == "Unhandled Error") {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  },
});

Sentry.configureScope((scope) => scope.setTransactionName("Images"));

class ValidationError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = `ERROR on - "${message}" `; // (2)
  }
}

const onUnhandledError = async (message) => {
  throw new Error(message);
  Sentry.showReportDialog({ eventId: event.event_id });
};

function App() {
  const [allImages, setAllImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);
  const inputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const getImages = async () => {
    const res = await axios({
      method: "get",
      mode: "cors",
      withCredentials: false,
      url: `${api_base_url}/images`,
    });
    const data = await res.data;
    return data;
  };

  const postImage = async (url, formdata) => {
    const res = await axios({
      method: "post",
      url: url,
      data: formdata,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  };

  const delImage = async (id) => {
    const res = await axios({
      method: "delete",
      url: `${api_base_url}/delete_image/${id}`,
    });
    return res;
  };

  // Function to calculate upload progress, but Axios lacks fidelity to do this properly
  // const onUploadProgress = (e) => {
  //   const percentage = Math.round((100 * e.loaded) / e.total);
  //   setUploadProgress(percentage);
  //   console.log(`Upload % = ${percentage}`);
  // };

  const onInputChange = (e) => {
    setIsSelected(true);
    setSelectedFile(e.target.files[0]);
  };

  const onFileUpload = async (e) => {
    setIsLoading(true);
    const formdata = new FormData();
    formdata.append("file", selectedFile, selectedFile.name);
    const res = await postImage(`${api_base_url}/add_image`, formdata);
    setIsUploadSuccessful(!isUploadSuccessful);
    setIsLoading(false);
    console.log(`Amazon Response: ${res}`);
    console.log(`File Uploaded: ${isUploadSuccessful}`);
  };

  const onFileDelete = async (image) => {
    const res = await delImage(image.id);
    if (res.status == "201") {
      setIsDeleteSuccessful(!isDeleteSuccessful);
      console.log(res);
      toast({
        title: `Delete Picture`,
        description: `We deleted ${image.name}`,
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onCreateError = async (image) => {
    // Add an attachment
    const name =
      image.name.substring(0, image.name.lastIndexOf(".")) || image.name;
    Sentry.configureScope((scope) => {
      scope.addAttachment({
        filename: `${name}.txt`,
        data: JSON.stringify(...image.ai_labels, ...image.ai_text),
      });
    });
    await image.ai_labels.map((label, index) => {
      Sentry.setTag(`Keyword-${index}`, label);
    });
    toast({
      title: "Error Sent",
      description: `We sent your ERROR on - ${image.name} to Sentry`,
      position: "top",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    // throw new ValidationError(image.name);
    throw new SuspectError(image.name);
    // Clear attachments
    Sentry.configureScope((scope) => {
      scope.clearAttachments();
    });
  };

  useEffect(() => {
    const images = getImages().then((res) => {
      console.log(res);
      setAllImages(res);
      inputRef.current.value = null;
    });
  }, [isUploadSuccessful, isDeleteSuccessful]);

  console.log(allImages);

  return (
    <ChakraProvider>
      <Center bg={brand.bg}>
        <VStack spacing={2}>
          <Image src={"/gh.png"}></Image>
          <HStack>
            <Text color={brand.light_violet}>Brought to you by: </Text>
            <Image
              htmlWidth="75px"
              objectFit="contain"
              src={"/sentry.png"}
            ></Image>
          </HStack>

          <HStack>
            <Heading as="h2" color={brand.cyan}>
              I'm a Smart'ish{" "}
              <Link color={brand.gold} href="https://sentry.io" isExternal>
                Sentry.io
              </Link>{" "}
              Gallery
            </Heading>
            <IconButton
              icon={<QuestionIcon />}
              color={brand.gold}
              size="sm"
              isRound={true}
              onClick={onOpen}
              variant="link"
              fontSize="2em"
            ></IconButton>
          </HStack>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>What is this supposed to be anyway?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text fontSize="lg">
                  This site was built using<br></br>
                  <Link
                    color={brand.flame}
                    href="https://github.com/"
                    isExternal
                  >
                    Github
                  </Link>
                  ,{" "}
                  <Link
                    color={brand.flame}
                    href="https://railway.app/"
                    isExternal
                  >
                    Railway
                  </Link>
                  ,{" "}
                  <Link
                    color={brand.flame}
                    href="https://vitejs.dev/"
                    isExternal
                  >
                    Vite
                  </Link>
                  ,{" "}
                  <Link
                    color={brand.flame}
                    href="https://fastapi.tiangolo.com/"
                    isExternal
                  >
                    FastAPI
                  </Link>
                  ,{" "}
                  <Link
                    color={brand.flame}
                    href="https://www.postgresql.org/"
                    isExternal
                  >
                    Postgres
                  </Link>
                  , <Text> and </Text>
                  <Link color={brand.flame} href="https://sentry.io" isExternal>
                    Sentry
                  </Link>
                </Text>
                <br></br>
                <VStack spacing={4} align="left">
                  <Text fontSize="lg">
                    Vite & FastAPI have been instrumented with Sentry Error
                    Monitoring and Performance Tracking.
                  </Text>
                  <Text>1. Upload a picture.</Text>
                  <Text>
                    2. If your pic contains the word "Error" or "Errors", the
                    FASTApi integration will issue an error.
                  </Text>
                  <Text>3. Then try clicking a button</Text>
                  <Text>
                    <WarningIcon color={brand.flame}></WarningIcon>
                    {" - "}
                    button to send an Error with your Image Name and Labels to
                    Sentry.
                  </Text>
                  <Text>
                    <ChatIcon color={brand.flame}></ChatIcon>
                    {" - "}
                    button to trap an Unhandled Error with Feedback.
                  </Text>
                  <Text>
                    <DeleteIcon color={brand.flame}></DeleteIcon>
                    {" - "}
                    button to delete a picture.
                  </Text>
                  <Text>
                    Login to{" "}
                    <Link
                      color={brand.flame}
                      href="https://sentry.io"
                      isExternal
                    >
                      Sentry.io
                    </Link>{" "}
                    to see your Errors, Perf and Feedback
                  </Text>
                  to see your Error(s) and browse Performance Data!
                  <Text>
                    <Text color={brand.flame}>Login Using</Text>ID:
                    demo@quickstark.com <br></br>PW: @Sentry2022
                  </Text>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="yellow" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button>
                  <Link
                    colorScheme="purple"
                    href="https://sentry.io"
                    isExternal
                  >
                    Sentry.io
                  </Link>
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <br></br>
          <HStack>
            <Input
              color={brand.gold}
              ref={inputRef}
              type="file"
              onChange={onInputChange}
              size="lg"
            />
            <Button
              rightIcon={<ArrowUpIcon />}
              bg={brand.gold}
              color={brand.dark_violet}
              iconSpacing={2}
              padding={5}
              size="lg"
              onClick={onFileUpload}
              isLoading={isLoading}
              loadingText="Upload"
              className="upload_button"
            >
              Upload Photo
            </Button>
          </HStack>
          <SimpleGrid columns={3} spacing={8}>
            {allImages.map((image) => {
              return (
                <div className="image_container">
                  <Text width={300} noOfLines={1}>
                    {image.name}
                  </Text>
                  <div className="button_container">
                    <IconButton
                      className="error_button"
                      colorScheme="yellow"
                      aria-label="Throw Error"
                      size="md"
                      onClick={() => onCreateError(image)}
                      icon={<WarningIcon />}
                    ></IconButton>
                    <IconButton
                      className="feedback_button"
                      colorScheme="orange"
                      aria-label="Send Feedback"
                      size="md"
                      onClick={() => onUnhandledError("Unhandled Error")}
                      icon={<ChatIcon />}
                    ></IconButton>
                    <IconButton
                      className="delete_button"
                      colorScheme="red"
                      aria-label="Delete Image"
                      size="md"
                      onClick={() => onFileDelete(image)}
                      icon={<DeleteIcon />}
                    ></IconButton>
                  </div>
                  <Image
                    key={image.id}
                    borderRadius={15}
                    boxSize="300px"
                    src={image.url}
                    objectFit="cover"
                  ></Image>
                  <Text className="label_container" width={300}>
                    {" "}
                    <span className="ai_text">Text: </span>{" "}
                    {image.ai_text?.length > 0
                      ? image.ai_text.slice(0, 10).join(",  ")
                      : "No Text Detected"}{" "}
                    <br></br>
                    <span className="ai_label">Labels: </span>{" "}
                    {image.ai_labels.length > 0
                      ? image.ai_labels?.slice(0, 10).join(",  ")
                      : "No Labels Detected"}{" "}
                  </Text>
                  {/* {image.ai_labels.map((label) => {
                    return <Text className="image_ai_labels">{label}</Text>;
                  })} */}
                </div>
              );
            })}
          </SimpleGrid>
        </VStack>
      </Center>
    </ChakraProvider>
  );
}

export default Sentry.withProfiler(App);
