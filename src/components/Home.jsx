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
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Link,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useMediaQuery } from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import * as Sentry from "@sentry/react";

import axios from "axios";
import React from "react";

const api_base_url = import.meta.env.VITE_API_BASE_URL;

// Change
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

export default function Home() {
  const [allImages, setAllImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);
  const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");
  const inputRef = useRef(null);
  const toast = useToast();

  const cols = isLargerThan1200 ? 4 : 1;

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
    if (inputRef.current.value == "") {
      toast({
        title: `Select an Image`,
        description: `Please select an image to upload`,
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("file", selectedFile, selectedFile.name);
      const res = await postImage(`${api_base_url}/add_image`, formdata);
      if (res.data?.message.includes("questionable")) {
        toast({
          title: `Questionable Content`,
          description: `${res.data.message}`,
          position: "top",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } else {
        setIsUploadSuccessful(!isUploadSuccessful);
        console.log(`Amazon Response: ${JSON.stringify(res)}`);
        console.log(`File Uploaded: ${isUploadSuccessful}`);
      }
    }
    setIsLoading(false);
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
    throw new ValidationError(image.name);
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
    <Center>
      <VStack spacing={2}>
        <Image htmlWidth="400px" objectFit="contain" src={"/ms.svg"}></Image>
        <HStack>
          <Image
            htmlWidth="75px"
            objectFit="contain"
            src={"/sentry.png"}
          ></Image>
        </HStack>
        <Heading textAlign="center" color="purple.300" as="h2">
          I'm a Smart'ish{" "}
          <Link color="purple.400" href="https://sentry.io" isExternal>
            Sentry.io
          </Link>{" "}
          Gallery
        </Heading>
        <br></br>
        <Input
          color="purple.300"
          ref={inputRef}
          type="file"
          onChange={onInputChange}
          size="lg"
          maxWidth={400}
        />
        <Button
          bg="yellow.500"
          rightIcon={<ArrowUpIcon />}
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
        <br></br>
        <SimpleGrid columns={cols} spacing={8}>
          {allImages.map((image) => {
            return (
              <div className="image_container">
                <Text color="purple.500" width={300} noOfLines={1}>
                  {image.name}
                </Text>
                <div className="button_container">
                  <IconButton
                    bg="gray.800"
                    color="yellow.300"
                    className="error_button"
                    colorScheme="yellow"
                    aria-label="Throw Error"
                    size="md"
                    onClick={() => onCreateError(image)}
                    icon={<WarningIcon />}
                  ></IconButton>
                  <IconButton
                    bg="gray.800"
                    color="yellow.300"
                    className="feedback_button"
                    colorScheme="orange"
                    aria-label="Send Feedback"
                    size="md"
                    onClick={() => onUnhandledError("Unhandled Error")}
                    icon={<ChatIcon />}
                  ></IconButton>
                  <IconButton
                    bg="gray.800"
                    color="red.500"
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
  );
}
